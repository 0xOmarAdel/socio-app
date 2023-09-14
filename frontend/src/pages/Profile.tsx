import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { selectUser } from "../store/slices/authSlice";
import { PostType } from "../Types/Post.types";
import useUserProfile from "../hooks/useUserProfile";
import PostForm from "../components/Post/PostForm";
import Posts from "../components/Post/Posts";

const Profile = () => {
  const { username } = useParams();
  const { profile, loading, error } = useUserProfile(username!);

  const currentUser = useSelector(selectUser);

  const [userPosts, setUserPosts] = useState<PostType[]>();
  const [isLoading, setIsLoading] = useState(true);

  const isMyProfile = currentUser?.username === profile?.username;
  
  const fetchPosts = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/posts/user/${username}`);
      setUserPosts(response.data);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }, [username]);
  
  const removePost = (postId: string) => {
    setUserPosts(prevState => prevState!.filter((post: PostType )=> post._id !== postId));
  };

  const updatePost = (postId: string, description: string, image: object) => {
    setUserPosts((prevState) => {
      const updatedPosts: PostType[] = [];
      prevState!.forEach(post => {
        if (post._id === postId) {
          updatedPosts.push({
            ...post,
            description: description,
            postImage: image && URL.createObjectURL(image)
          });
        } else {
          updatedPosts.push(post);
        }
      });
      return updatedPosts;
    });
  };
  
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (loading || isLoading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>Error: {error}</div>;
  } else {
    return (
      <>
        {isMyProfile && <PostForm fetchPosts={fetchPosts} />}
        {userPosts!.length > 0 ? (
          <Posts posts={userPosts!} removePost={removePost} updatePost={updatePost} />
        ) : (
          <div className="text-center text-gray-800 text-xl">
            There are no posts yet for this user.
          </div>
        )}
      </>
    );
  }
};

export default Profile;
