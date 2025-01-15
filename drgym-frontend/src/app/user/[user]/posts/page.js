'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Typography from '@mui/material/Typography';
import { withSnackbar } from '@/utils/snackbarProvider';
import PostList from '@/components/PostList';
import { getUsername } from '@/utils/localStorage';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

const PostsContent = ({ showAppMessage }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [onlyThisUser, setOnlyThisUser] = useState(false);

  const username = getUsername();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const message = searchParams.get('message');
    const type = searchParams.get('type');
    if (message) {
      router.replace(`${pathname}`, undefined, { shallow: true });
      showAppMessage({
        status: true,
        text: message,
        type: type || 'info',
      });
    }
  }, [router, pathname, searchParams, showAppMessage]);

  const handleChange = (event, newOption) => {
    setOnlyThisUser(newOption === 'my');
  };

  return (
    <>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ pt: 1, pb: 2 }}
      >
        <ToggleButtonGroup
          color="info"
          value={onlyThisUser ? 'my' : 'friends'}
          exclusive
          onChange={handleChange}
          aria-label="Whose posts to show"
        >
          <ToggleButton value="friends">Friends&apos; posts</ToggleButton>
          <ToggleButton value="my">My posts</ToggleButton>
        </ToggleButtonGroup>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Add post
        </Button>
      </Grid>
      <PostList
        username={username}
        onlyThisUser={onlyThisUser}
        showAppMessage={showAppMessage}
      />
      ;
    </>
  );
};

const Posts = ({ showAppMessage }) => {
  return (
    <Suspense fallback={<Typography>Loading posts...</Typography>}>
      <PostsContent showAppMessage={showAppMessage} />
    </Suspense>
  );
};

export default withSnackbar(Posts);
