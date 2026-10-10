import { useQuery } from "@tanstack/react-query";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import {
  Avatar,
  Button,
  Dropdown,
  Label,
  Typography,
} from "@heroui/react";
import { Link, useParams } from "react-router-dom";
import AllComment from "../AllComment/AllComment";
import CreateComment from "../CreateComment/CreateComment";
import FollowSuggestions from "../FollowSuggestion/FollowSuggestions.jsx";

let BASE_URL = "https://route-posts.routemisr.com";

export default function PostDetails() {
  let { id } = useParams();

  function getPostDetails() {
    return axios.get(`${BASE_URL}/posts/${id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  }

  let { data, isLoading, isError, error } = useQuery({
    queryKey: ["post", id],
    queryFn: getPostDetails,
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <ClipLoader color="#2875ff" size={47} speedMultiplier={0.55} />
      </div>
    );
  }

  let post = data?.data?.data?.post;

  if (isError || !post) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[70vh] flex-col items-center justify-center bg-gray-50 px-4 text-center">
          <div className="rounded-2xl border border-blue-100 bg-white p-8 shadow-sm">
            <h2 className="mb-3 text-xl font-bold text-gray-800">
              Couldn't load this post
            </h2>
            <p className="mb-5 text-sm text-gray-500">
              {error?.response?.data?.message ||
                "Something went wrong. Please try again."}
            </p>
            <Link
              to="/home"
              className="inline-flex rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 pb-12">
        {/* Page Header */}
        <div className="border-b border-blue-100 bg-white ">
          <div className="mx-auto flex max-w-350 items-center justify-between px-4 py-6 ">
            <div className="mx-auto text-center">
              <p className="mb-1 text-sm font-medium text-blue-600">
                YOUR COMMUNITY
              </p>
              <Typography
                type="h1"
                className="text-2xl font-bold text-[#102654] md:text-3xl mx-auto text-center"
              >
                Post Details
              </Typography>
              <p className="mt-2 text-sm text-gray-500 mx-auto text-center">
                Join the conversation and share your thoughts.
              </p>
            </div>

         
          </div>
        </div>

        {/* Main Layout */}
        <div className="mx-auto mt-7 max-w-350 px-4">
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">

            {/* Main Post Column */}
            <main className="mx-auto w-full min-w-0 max-w-212.5 lg:mx-0 lg:max-w-none">

              {/* Post Card */}
              <article className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">

                {/* Author Header */}
                <div className="flex items-center justify-between border-b border-gray-100 p-5 md:p-6">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar
                      size="lg"
                      className="shrink-0 ring-2 ring-blue-100"
                    >
                      <Avatar.Image
                        alt={post.user?.username || "User"}
                        src={post.user?.photo}
                      />
                    </Avatar>

                    <div className="min-w-0">
                      <p className="truncate font-bold text-[#102654]">
                        {post.user?.username || "User"}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {post.createdAt}
                      </p>
                    </div>
                  </div>

                  {/* Menu */}
                  <Dropdown>
                    <Button
                      aria-label="Post menu"
                      variant="secondary"
                      className="h-10 min-w-10 rounded-full bg-blue-50 text-xl text-blue-600 hover:bg-blue-100"
                    >
                      ⋯
                    </Button>

                    <Dropdown.Popover>
                      <Dropdown.Menu>
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
                        >
                          <Label>Delete</Label>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown.Popover>
                  </Dropdown>
                </div>

                {/* Post Content */}
                <div className="p-5 md:p-6">
                  {post.body && (
                    <Typography
                      type="h6"
                      className="mb-5 whitespace-pre-wrap text-base leading-8 text-gray-700"
                    >
                      {post.body}
                    </Typography>
                  )}

                  {post.image && (
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                      <img
                        src={post.image}
                        alt="Post"
                        className="max-w-162.5 w-full object-contain"
                      />
                    </div>
                  )}

                  {/* Top Comment */}
                  {post.topComment && (
                    <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 md:p-5">
                      <div className="mb-3 flex items-center gap-3">
                        <Avatar
                          size="md"
                          className="shrink-0 ring-2 ring-white"
                        >
                          <Avatar.Image
                            alt={
                              post.topComment.commentCreator?.name ||
                              "Comment author"
                            }
                            src={post.topComment.commentCreator?.photo}
                          />
                        </Avatar>

                        <div className="min-w-0">
                          <p className="font-semibold text-[#102654]">
                            {post.topComment.commentCreator?.name}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            {post.topComment.createdAt}
                          </p>
                        </div>

                        <span className="ml-auto rounded-full bg-white px-3 py-1 text-xs font-medium text-blue-600">
                          Top comment
                        </span>
                      </div>

                      <p className="whitespace-pre-wrap leading-7 text-gray-700">
                        {post.topComment.content}
                      </p>
                    </div>
                  )}
                </div>

                {/* Add Comment */}
                <div className="border-t border-gray-100 bg-white p-5 md:p-6">
                  <h3 className="mb-4 text-lg font-bold text-[#102654]">
                    Write a comment
                  </h3>
                  <CreateComment postId={post._id} />
                </div>
              </article>

              {/* All Comments */}
              <section className="mt-7 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm md:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[#102654]">
                    Comments
                  </h2>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                    Discussion
                  </span>
                </div>

                <AllComment postId={post._id} />
              </section>
            </main>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-5">
                <FollowSuggestions />

                <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
                  <h3 className="mb-2 font-bold text-[#102654]">
                    Keep the conversation going
                  </h3>
                  <p className="text-sm leading-6 text-gray-500">
                    Share your opinion, connect with other people, and
                    discover more posts from your community.
                  </p>

                  <Link
                    to="/home"
                    className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Explore Home
                  </Link>
                </div>
              </div>
            </aside>

            {/* Sidebar on Mobile */}
            <div className="lg:hidden">
              <FollowSuggestions />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}