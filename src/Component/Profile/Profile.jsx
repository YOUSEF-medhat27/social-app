
import { Avatar, Button } from "@heroui/react";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";




export default function Profile() {

    const Name = localStorage.getItem("Name")
    const username = localStorage.getItem("username")


    function getMyPosts() {
        return axios.get(
            "https://route-posts.routemisr.com/posts", {
            headers: {
                Authorization:
                    "Bearer " + localStorage.getItem("token")
            }
        });
    }

    const { data, isLoading } = useQuery({
        queryKey: ["myPosts", username],
        queryFn: getMyPosts
    });

    if (isLoading) {
        return (
            <div className="h-screen flex justify-center items-center">
                <ClipLoader color="#36d7b7" size={47} speedMultiplier={0.55} />
            </div>);
    }

    const posts = data?.data?.data?.posts || [];
    const myPosts = posts.filter(function (post) {
        return post.user.username === username;
    });


    return <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-8">

            <div className="w-[95%] md:w-[85%] lg:w-[70%] mx-auto">

                <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">


                    <div className="h-36 md:h-48 bg-blue-600 relative">

                        <div className="absolute inset-0 bg-linear-to-r from-blue-700 to-blue-400 opacity-90"></div>

                    </div>


                    <div className="px-5 md:px-8 pb-7">


                        <div className="flex flex-col md:flex-row md:items-end md:justify-between">

                            <div className="flex items-end gap-4 -mt-14">

                                <div className="bg-white p-1 rounded-full shadow-lg">

                                    <Avatar className="w-24 h-24 md:w-28 md:h-28">

                                        <Avatar.Image
                                            src="./src/assets/images/avatar-3.jpg"
                                            alt="Profile"
                                        />

                                    </Avatar>

                                </div>



                                <div className="mb-2">

                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                        {Name}
                                    </h1>

                                    <p className="text-gray-500">
                                        @{username}
                                    </p>

                                </div>

                            </div>



                            <Button
                                className="mt-5 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7"
                            >
                                Edit Profile
                            </Button>

                        </div>


                        <div className="mt-6">

                            <p className="text-gray-600 leading-7 max-w-2xl">
                                Frontend Developer passionate about React,
                                modern web development and building beautiful
                                user interfaces.
                            </p>

                        </div>


                        <div className="grid grid-cols-3 mt-7 bg-blue-50 rounded-xl overflow-hidden border border-blue-100">

                            <div className="text-center py-4 border-r border-blue-100">

                                <p className="text-2xl font-bold text-blue-700">
                                    {myPosts.length}
                                </p>

                                <p className="text-sm text-gray-500 mt-1">
                                    Posts
                                </p>

                            </div>


                            <div className="text-center py-4 border-r border-blue-100">

                                <p className="text-2xl font-bold text-blue-700">
                                    1.2K
                                </p>

                                <p className="text-sm text-gray-500 mt-1">
                                    Followers
                                </p>

                            </div>


                            <div className="text-center py-4">

                                <p className="text-2xl font-bold text-blue-700">
                                    320
                                </p>

                                <p className="text-sm text-gray-500 mt-1">
                                    Following
                                </p>

                            </div>

                        </div>

                    </div>

                </div>



                <div className="bg-white mt-6 rounded-xl shadow-sm border border-gray-200">

                    <div className="flex items-center gap-8 px-6 border-b border-gray-200">

                        <button className="relative py-4 text-blue-600 font-semibold">

                            Posts

                            <span className="absolute bottom-0 left-0 right-0 h-.5 bg-blue-600 rounded-t"></span>

                        </button>


                        <button className="py-4 text-gray-500 hover:text-blue-600 transition">

                            Saved

                        </button>

                    </div>



                    <div className="bg-white mt-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-8 px-6 border-b border-gray-200">
                            <button className="relative py-4 text-blue-600 font-semibold">
                                Posts

                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t"></span>
                            </button>

                            <button className="py-4 text-gray-500 hover:text-blue-600 transition">
                                Saved
                            </button>
                        </div>

                        <div className="p-5">
                            <h2 className="text-xl font-bold text-gray-800 mb-5">
                                My Posts
                            </h2>

                            {myPosts.length === 0 ? (
                                <p className="text-center text-gray-500 py-10">
                                    You haven't created any posts yet.
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {myPosts.map(function (post) {
                                        return (
                                            <Link
                                                key={post.id}
                                                to={`/PostDetails/${post.id}`}
                                                className="block"
                                            >
                                                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition">
                                                    {/* Image */}
                                                    {post.image ? (
                                                        <div className="h-48 bg-blue-100">
                                                            <img
                                                                src={post.image}
                                                                alt=""
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="h-48 bg-blue-50 flex items-center justify-center">
                                                            <p className="text-blue-400">
                                                                No Image
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Content */}
                                                    <div className="p-4">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Avatar
                                                                size="sm"
                                                                className="ring-1 ring-blue-100"
                                                            >
                                                                <Avatar.Image
                                                                    src={post.user.photo}
                                                                    alt={post.user.username}
                                                                />
                                                            </Avatar>

                                                            <p className="text-sm font-semibold text-gray-700">
                                                                {post.user.username}
                                                            </p>
                                                        </div>

                                                        {post.body && (
                                                            <p className="font-semibold text-gray-800 line-clamp-2">
                                                                {post.body}
                                                            </p>
                                                        )}

                                                        <p className="text-gray-400 text-xs mt-4">
                                                            {post.createdAt}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                </div>

            </div>

        </div>
    </>



}
