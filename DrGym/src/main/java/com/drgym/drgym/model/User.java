import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


public class User extends UserTemplate {
    private double weight;
    private double height;
    private Set<User> friends = new HashSet<>();
    // private Exercise favoriteExercise; (when Excercise class will be available)
    // private List<Training> trainingHistory = new ArrayList<>(); (when Training class will be available)
    // private List<Post> posts = new ArrayList<>(); (when Post class will be available)

    // empty constructor
    public User() {}

    // basic constructor without lists
    public User(
            int id,
            String username,
            String name,
            String surname,
            String email,
            String password,
            double weight,
            double height
    ) {
        super(id, username, name, surname, email, password);
        this.weight = weight;
        this.height = height;
    }

    /* soon
    public User(
            int id,
            String username,
            String name,
            String surname,
            String email,
            String password,
            double weight,
            double height,
            Set<User> friends,
            Exercise favoriteExercise,
            List<Training> trainingHistory,
            List<Post> posts
    ) {
        super(id, username, name, surname, email, password);
        this.weight = weight;
        this.height = height;
        this.friends = friends;
        this.favouriteExercise = favouriteExercise;
        this.trainingHistory = trainingHistory;
        this.posts = posts;
    }
    */

    // getters
    public double getWeight() {
        return weight;
    }

    public double getHeight() {
        return height;
    }

    public Set<User> getFriends() {
        return friends;
    }
    /*
    public Exercise getFavoriteExercise() {
        return favouriteExcercise;
    }

    public List<Training> getTrainingHistory {
        return trainingHistory;
    }

    public List<Post> getPosts() {
        return posts;
    }
    */

    // setters
    public void setWeight(double newWeight) {
        this.weight = newWeight;
    }

    public void setHeight(double newHeight) {
        this.height = newHeight;
    }

    public void setFriends(Set<User> newFriends) {
        this.friends = newFriends;
    }

    /*
    public void setFavoriteExercise(Exercise newFavouriteExercise) {
        this.favouriteExercise = newFavouriteExercise
    }

    public void setTrainingHistory(List<Training> newTrainingHistory) {
        this.trainingHistory = newTrainingHistory
    }

    public void setPosts(List<Post> newPosts) {
        this.posts = newPosts;
    }
    */

    public void addFriend(User newFriend) {
        if (!this.equals(newFriend)) {
            this.friends.add(newFriend);
            newFriend.addFriend(this);
        }
    }

    public void removeFriend(User friend) {
        this.friends.remove(friend);
        friend.removeFriend(this);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || obj.getClass() != this.getClass()) return false;
        final User user = (User) obj;
        return this.getId() != null && this.getId().equals(user.getId());
    }
}
