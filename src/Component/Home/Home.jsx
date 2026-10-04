
import axios from "axios";
import Navbar from "../Navbar/Navbar";

import { Avatar, Button, Dropdown, Label, Typography } from "@heroui/react";
import { ClipLoader } from "react-spinners";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import CreateComment from "../CreateComment/CreateComment";
import CreatePost from "../CreatePost/CreatePost";

export default function Home() {





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
  let { data, isError, isFetching, isLoading, refetch } = useQuery({
    queryKey: ["Posts"],
    queryFn: getAllPosts
  });



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

  return <>

    <Navbar />

    <CreatePost />
    <div className="min-h-screen bg-gray-50 py-8">

      <Typography
        type="h1"
        align="center"
        className="text-blue-700 text-3xl font-bold mb-8"
      >
        Home
      </Typography>

      {data?.data.data.posts.map(function (post) {

        return (
          <div key={post.id} className="mb-6">

            <div className="w-[95%] md:w-[65%] lg:w-[55%] mx-auto">

              {/* Post Card */}
              <div className="bg-white rounded-2xl border border-blue-100 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">

                <div className="p-5">

                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-5">

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

                        <p className="text-sm text-gray-400 mt-1">
                          {post.createdAt}
                        </p>

                      </div>

                    </div>


                    {/* Post Menu */}
                    <Dropdown>

                      <Button
                        aria-label="Menu"
                        variant="secondary"
                        className="min-w-10 w-10 h-10 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                      >
                        ⋯
                      </Button>


                      <Dropdown.Popover>

                        <Dropdown.Menu
                          onAction={(key) =>
                            console.log(`Selected: ${key}`)
                          }
                        >

                          <Dropdown.Item
                            id="edit-file"
                            textValue="Edit file"
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

                  </div>


                  {/* Post Body */}
                  <div className="post-body">

                    {post?.body && (
                      <Typography
                        type="h6"
                        className="text-gray-700 leading-7 mb-4"
                      >
                        {post.body}
                      </Typography>
                    )}


                    {/* Post Image */}
                    {post?.image && (
                      <div className="rounded-xl overflow-hidden mb-4">

                        <img
                          src={post.image}
                          className="w-full max-h-125 object-cover hover:scale-[1.02] transition duration-500"
                          alt=""
                        />

                      </div>
                    )}


                    {/* Details Link */}
                    <Link
                      className="inline-block text-blue-600 font-medium hover:text-blue-800 transition"
                      to={`/PostDetails/${post.id}`}
                    >
                      View Post Details →
                    </Link>

                  </div>


                  {/* Top Comment */}
                  {post?.topComment && (

                    <div className="comment mt-5 bg-blue-50 border border-blue-100 rounded-xl p-4">

                      {/* Comment Header */}
                      <div className="flex items-center justify-between">

                        <div className="flex items-center">

                          <Avatar
                            size="lg"
                            className="ring-2 ring-white"
                          >
                            <Avatar.Image
                              alt="Comment User"
                              src={post.topComment.commentCreator.photo}
                            />
                          </Avatar>


                          <div className="px-3">

                            <p className="font-semibold text-gray-800">
                              {post.topComment.commentCreator.name}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              {post.topComment.createdAt}
                            </p>

                          </div>

                        </div>


                        {/* Comment Menu */}
                        <Dropdown>

                          <Button
                            aria-label="Menu"
                            variant="secondary"
                            className="min-w-9 w-9 h-9 rounded-full bg-white text-blue-600 hover:bg-blue-100"
                          >
                            ⋯
                          </Button>


                          <Dropdown.Popover>

                            <Dropdown.Menu
                              onAction={(key) =>
                                console.log(`Selected: ${key}`)
                              }
                            >

                              <Dropdown.Item
                                id="edit-file"
                                textValue="Edit file"
                              >
                                <Label>Edit</Label>
                              </Dropdown.Item>


                              <Dropdown.Item
                                id="delete-file"
                                textValue="Delete file"
                                variant="danger"
                                onClick={() => deletePost(post.id)}
                              >
                                <Label>Delete</Label>
                              </Dropdown.Item>

                            </Dropdown.Menu>

                          </Dropdown.Popover>

                        </Dropdown>

                      </div>


                      {/* Comment Content */}
                      <div className="mt-4 px-1">

                        <p className="text-gray-600 leading-6">
                          {post.topComment.content}
                        </p>

                      </div>

                    </div>

                  )}
                  <CreateComment postId={post._id} />

                </div>

              </div>


            </div>

          </div>
        );

      })}

    </div>


  </>;
}