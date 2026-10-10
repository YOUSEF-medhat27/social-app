
import axios from "axios";
import Navbar from "../Navbar/Navbar";

import { Avatar, Button, Dropdown, Label, Typography } from "@heroui/react";
import { ClipLoader } from "react-spinners";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import CreateComment from "../CreateComment/CreateComment";
import CreatePost from "../CreatePost/CreatePost";
import { useState } from "react";
import FollowSuggestions from "../FollowSuggestion/FollowSuggestions";

export default function Home() {
  const Name = localStorage.getItem("Name");
  const username = localStorage.getItem("username");
  const currentUsername = localStorage.getItem("username");
  const [editingPostId, setEditingPostId] = useState(null);
  const [editBody, setEditBody] = useState("");
  const [editImage, setEditImage] = useState(null);


  function getAllPosts() {
    return axios.get(
      "https://route-posts.routemisr.com/posts",
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }
    );
  }
  let { data, isLoading, refetch } = useQuery({
    queryKey: ["Posts"],
    queryFn: getAllPosts
  });

  console.log(data);




  if (isLoading) {
    return <div className="h-screen flex justify-center items-center">
      <ClipLoader
        color="#36d7b7"
        size={47}
        speedMultiplier={0.55}
      />
    </div>
  }
  async function deletePost(postId) {
    try {
      let response = await axios.delete(
        `https://route-posts.routemisr.com/posts/${postId}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      );

      console.log(response.data);

      refetch();

    } catch (error) {
      console.log(error.response?.data);
    }
  }

  function startEdit(post) {
    setEditingPostId(post._id);
    setEditBody(post.body || "");
    setEditImage(null);
  }
  async function updatePost(postId) {
    try {
      const formData = new FormData();

      formData.append("body", editBody);

      if (editImage) {
        formData.append("image", editImage);
      }

      let response = await axios.put(
        `https://route-posts.routemisr.com/posts/${postId}`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      console.log(response.data);

      setEditingPostId(null);
      setEditBody("");
      setEditImage(null);

      refetch();

    } catch (error) {
      console.log(error.response?.data);
    }
  }

 
return (
  <>
    <Navbar />

    <div className="min-h-screen bg-gray-50">
      {/* Create Post */}
      <div className="pt-6">
        <CreatePost />
      </div>

      {/* Page Title */}
      <Typography
        type="h1"
        align="center"
        className="mb-8 mt-6 text-3xl font-bold text-blue-700"
      >
        Home
      </Typography>

      {/* Main Layout */}
      <div className="mx-auto max-w-350 px-4 pb-10">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">

          {/* Posts Section */}
          <main className="min-w-0">
            {data?.data?.data?.posts?.map((post) => {
              const isMyPost =
                post.user.username === currentUsername;

              return (
                <div key={post._id} className="mb-6">
                  <div className="mx-auto w-full max-w-187.5">

                    <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-md transition-all duration-300 hover:shadow-lg">

                      <div className="p-5">

                        {/* Post Header */}
                        <div className="mb-5 flex items-center justify-between">

                          <div className="flex items-center">
                            <Avatar
                              size="lg"
                              className="ring-2 ring-blue-100"
                            >
                              <Avatar.Image
                                alt="User"
                                src={post.user.photo}
                              />
                            </Avatar>

                            <div className="px-3">
                              <p className="font-semibold text-gray-800">
                                {post.user.username}
                              </p>

                              <p className="mt-1 text-sm text-gray-400">
                                {post.createdAt}
                              </p>
                            </div>
                          </div>

                          {/* Edit/Delete My Posts Only */}
                          {isMyPost && (
                            <Dropdown>
                              <Button
                                aria-label="Menu"
                                variant="secondary"
                                className="h-10 min-w-10 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                              >
                                ⋯
                              </Button>

                              <Dropdown.Popover>
                                <Dropdown.Menu>
                                  <Dropdown.Item
                                    id="edit-file"
                                    textValue="Edit file"
                                    onClick={() => startEdit(post)}
                                  >
                                    <Label>Edit</Label>
                                  </Dropdown.Item>

                                  <Dropdown.Item
                                    id="delete-file"
                                    textValue="Delete file"
                                    variant="danger"
                                    onClick={() => deletePost(post._id)}
                                  >
                                    <Label>Delete</Label>
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown.Popover>
                            </Dropdown>
                          )}
                        </div>

                        {/* Post Body / Edit Form */}
                        <div className="post-body">

                          {editingPostId === post._id ? (
                            <div className="space-y-4">

                              <textarea
                                value={editBody}
                                onChange={(e) =>
                                  setEditBody(e.target.value)
                                }
                                className="min-h-32 w-full resize-none rounded-xl border border-blue-200 p-4 outline-none focus:border-blue-500"
                                placeholder="Write your post..."
                              />

                              <div>
                                <label className="mb-2 block font-medium text-gray-700">
                                  Change Image
                                </label>

                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) =>
                                    setEditImage(
                                      e.target.files?.[0] || null
                                    )
                                  }
                                  className="w-full rounded-lg border border-gray-200 p-2"
                                />
                              </div>

                              <div className="flex gap-3">
                                <Button
                                  className="bg-blue-600 text-white"
                                  onPress={() => updatePost(post._id)}
                                >
                                  Save
                                </Button>

                                <Button
                                  variant="secondary"
                                  onPress={() => {
                                    setEditingPostId(null);
                                    setEditBody("");
                                    setEditImage(null);
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {post?.body && (
                                <Typography
                                  type="h6"
                                  className="mb-4 leading-7 text-gray-700"
                                >
                                  {post.body}
                                </Typography>
                              )}

                              {post?.image && (
                                <div className="mb-4 overflow-hidden rounded-xl">
                                  <img
                                    src={post.image}
                                    className="max-h-125 w-full object-cover transition duration-500 hover:scale-[1.02]"
                                    alt="Post"
                                  />
                                </div>
                              )}

                              <Link
                                className="inline-block font-medium text-blue-600 transition hover:text-blue-800"
                                to={`/PostDetails/${post._id}`}
                              >
                                View Post Details →
                              </Link>
                            </>
                          )}
                        </div>

                        {/* Top Comment */}
                        {post?.topComment && (
                          <div className="comment mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">

                            <div className="flex items-center justify-between">

                              <div className="flex items-center">
                                <Avatar
                                  size="lg"
                                  className="ring-2 ring-white"
                                >
                                  <Avatar.Image
                                    alt="Comment User"
                                    src={
                                      post.topComment.commentCreator.photo
                                    }
                                  />
                                </Avatar>

                                <div className="px-3">
                                  <p className="font-semibold text-gray-800">
                                    {post.topComment.commentCreator.name}
                                  </p>

                                  <p className="mt-1 text-xs text-gray-400">
                                    {post.topComment.createdAt}
                                  </p>
                                </div>
                              </div>

                            </div>

                            <div className="mt-4 px-1">
                              <p className="leading-6 text-gray-600">
                                {post.topComment.content}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Create Comment */}
                        <CreateComment postId={post._id} />

                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </main>

          {/* Right Sidebar - Desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <FollowSuggestions />
            </div>
          </aside>

        </div>

        {/* Follow Suggestions - Mobile */}
        <div className="mt-6 lg:hidden">
          <FollowSuggestions />
        </div>
      </div>
    </div>
  </>
);
;
}