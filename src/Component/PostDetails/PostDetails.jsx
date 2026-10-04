import { useQuery } from "@tanstack/react-query";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { Avatar, Button, Dropdown, Label, Typography } from "@heroui/react";
import { useParams } from "react-router-dom";
import AllComment from "../AllComment/AllComment";
import CreateComment from "../CreateComment/CreateComment";


export default function PostDetails() {




    let { id } = useParams();

    function getpostdetails() {
        return axios.get(
            `https://route-posts.routemisr.com/posts/${id}`,
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }
        );
    }

    let { data, isLoading } = useQuery({
        queryKey: ["post", id],
        queryFn: getpostdetails
    })

    if (isLoading) {
        return <div className="h-screen flex justify-center items-center">
            <ClipLoader
                color="#36d7b7"
                size={47}
                speedMultiplier={0.55}
            />
        </div>
    }


    let post = data.data.data.post







    return <>


        <Navbar />

        <Typography
            type="h1"
            align="center"
            className="text-blue-700 text-3xl font-bold mt-8 mb-8"
        >
            PostDetails
        </Typography>

        <div className="my-5">
            <div className="p-5 w-[95%] md:w-[60%] md:mx-auto">

                <div className="posts bg-white rounded-2xl border border-blue-100 shadow-md p-5 hover:shadow-lg transition-shadow duration-300">

                    <div className="post">

                        {/* Post Header */}
                        <div className="header flex items-start justify-between mb-5">

                            <div className="flex items-center">

                                <Avatar size="lg">
                                    <Avatar.Image
                                        alt="John Doe"
                                        src={post.user.photo}
                                        className="ring-2 ring-blue-100"
                                    />
                                </Avatar>

                                <div className="name px-4">
                                    <p className="font-semibold text-gray-800">
                                        {post.user.username}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {post.createdAt}
                                    </p>
                                </div>

                            </div>

                            <Dropdown>

                                <Button
                                    aria-label="Menu"
                                    variant="secondary"
                                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-0"
                                >
                                    ...
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
                                        >
                                            <Label>Delete</Label>
                                        </Dropdown.Item>

                                    </Dropdown.Menu>

                                </Dropdown.Popover>

                            </Dropdown>

                        </div>


                        {/* Post Body */}
                        <div className="post-body">

                            {post?.body ? (
                                <Typography
                                    type="h6"
                                    className="text-gray-700 leading-7 mb-4"
                                >
                                    {post.body}
                                </Typography>
                            ) : ""}


                            {post?.image ? (
                                <img
                                    src={post.image}
                                    className="w-full rounded-xl object-cover max-h-150"
                                    alt=""
                                />
                            ) : ""}

                        </div>


                        {/* Top Comment */}
                        {post?.topComment ? (
                            <div className="comment mt-5 bg-blue-50 border border-blue-100 rounded-xl p-4">

                                <div className="flex justify-between items-center">

                                    <div className="flex items-center">

                                        <Avatar size="lg">
                                            <Avatar.Image
                                                alt="John Doe"
                                                src={post.topComment.commentCreator.photo}
                                                className="ring-2 ring-white"
                                            />
                                        </Avatar>

                                        <div className="name px-4">

                                            <p className="font-semibold text-gray-800">
                                                {post.topComment.commentCreator.name}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {post.topComment.createdAt}
                                            </p>

                                        </div>

                                    </div>


                                    <Dropdown>

                                        <Button
                                            aria-label="Menu"
                                            variant="secondary"
                                            className="bg-white text-blue-600 hover:bg-blue-100 border-0"
                                        >
                                            ...
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
                                                >
                                                    <Label>Delete</Label>
                                                </Dropdown.Item>

                                            </Dropdown.Menu>

                                        </Dropdown.Popover>

                                    </Dropdown>

                                </div>


                                <div className="mt-3">

                                    <p className="text-gray-700 leading-6">
                                        {post.topComment.content}
                                    </p>

                                </div>

                            </div>
                        ) : ""}


                        {/* All Comments */}
                        <div className="mt-6">
                            <AllComment postId={post.id} />
                        </div>
                        <CreateComment postId={post._id} />

                    </div>

                </div>

            </div>
        </div>
        


    </>
}
