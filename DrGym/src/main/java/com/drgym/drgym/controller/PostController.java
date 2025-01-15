package com.drgym.drgym.controller;

import com.drgym.drgym.model.*;
import com.drgym.drgym.service.ExerciseService;
import com.drgym.drgym.service.PostService;
import com.drgym.drgym.service.PostReactionService;
import com.drgym.drgym.service.WorkoutService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private PostReactionService postReactionService;

    @Autowired
    private WorkoutService workoutService;

    @Autowired
    private UserController userController;

    @GetMapping("/{postId}")
    public ResponseEntity<?> getPost(@PathVariable Long postId, HttpServletRequest request) {
        Optional<Post> postOptional = postService.findPostById(postId);
        if (postOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Post post = postOptional.get();
        String username = post.getUsername();
        if (!userController.tokenOwnerOrFriend(username, request)) {
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).body("Unauthorized");
        }

        Workout workout = post.getTraining();
        if (workout != null) {
            List<Activity> activities = workoutService.findActivitiesByWorkoutId(workout.getId());
            workout.setActivities(activities);
        }

        return ResponseEntity.ok(post);
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<?> getUserPosts(@PathVariable String username, HttpServletRequest request) {
        if (!userController.tokenOwnerOrFriend(username, request)) {
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).body("Unauthorized");
        }

        List<Post> posts = postService.findPostsByUsername(username);
        if (posts.isEmpty()) {
            return ResponseEntity.ok("[]");
        }

        posts.forEach(post -> {
            Workout workout = post.getTraining();
            if (workout != null) {
                List<Activity> activities = workoutService.findActivitiesByWorkoutId(workout.getId());
                workout.setActivities(activities);
            }
        });

        return ResponseEntity.ok(posts);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createPost(@RequestBody PostCreateRequest postRequest, HttpServletRequest request) {
        if (!userController.tokenOwner(postRequest.getUsername(), request)) {
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).body("Unauthorized");
        }
        return postService.createPost(postRequest);
    }

    @PostMapping("/create_with_workout")
    public ResponseEntity<?> createPost(@RequestBody PostCreateRequestWorkout postRequest, HttpServletRequest request) {
        if (!userController.tokenOwner(postRequest.getUsername(), request)) {
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).body("Unauthorized");
        }
        return postService.createPostWorkout(postRequest);
    }

    @GetMapping("/{postId}/reactions")
    public ResponseEntity<?> getReactionsForPost(@PathVariable Long postId, HttpServletRequest request) {
        Optional<Post> postOptional = postService.findPostById(postId);
        if (postOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Post post = postOptional.get();
        String username = post.getUsername();

        if (!userController.tokenOwnerOrFriend(username, request)) {
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).body("Unauthorized");
        }

        List<PostReaction> reactions = postReactionService.findByPostId(postId);
        if (reactions.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(reactions);
    }

    @PostMapping("/{postId}/reactions")
    public ResponseEntity<?> addReactionToPost(@PathVariable Long postId, @RequestParam String username, HttpServletRequest request) {
        if (!userController.tokenOwnerOrFriend(username, request)) {
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).body("Unauthorized");
        }
        PostReaction reaction = new PostReaction(postId, username);
        postReactionService.addReaction(reaction);
        return ResponseEntity.ok("Reaction added successfully.");
    }

    @DeleteMapping("/{postId}/reactions")
    public ResponseEntity<?> deleteReaction(@PathVariable Long postId, @RequestParam String username, HttpServletRequest request) {
        if (!userController.tokenOwnerOrFriend(username, request)) {
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).body("Unauthorized");
        }

        postReactionService.removeReactionByUsername(postId, username);
        return ResponseEntity.noContent().build();
    }
}
