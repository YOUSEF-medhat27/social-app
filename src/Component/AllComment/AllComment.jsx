import axios from "axios";
import {
    useMutation,
    useQuery,
    useQueryClient
} from "@tanstack/react-query";

import {
    Avatar,
    Button,
    Dropdown,
    Input,
    Label
} from "@heroui/react";

import { ClipLoader } from "react-spinners";
import { useState } from "react";

export default function AllComment({ postId }) {

    let queryclient = useQueryClient();

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editContent, setEditContent] = useState("");



    function getComments() {

        return axios.get(
            `https://route-posts.routemisr.com/posts/${postId}/comments?page=1&limit=10`,
            {
                headers: {
                    Authorization:
                        "Bearer " + localStorage.getItem("token")
                }
            }
        );
    }

    let { data, isLoading } = useQuery({
        queryKey: ["comments", postId],
        queryFn: getComments
    });


    let comments = data?.data?.data?.comments || [];


    function getCurrentUser() {

        return axios.get(
            "https://route-posts.routemisr.com/users/profile-data",
            {
                headers: {
                    Authorization:
                        "Bearer " + localStorage.getItem("token")
                }
            }
        );
    }

    let { data: userData } = useQuery({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser
    });


    let currentUser = userData?.data?.data?.user;

    let {
        mutate: deleteComment,
        isPending: isDeleting
    } = useMutation({

        mutationFn: function (commentId) {

            return axios.delete(
                `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
                {
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem("token")
                    }
                }
            );
        },

        onSuccess: function (data) {

            console.log("DELETE:", data);

            queryclient.invalidateQueries({
                queryKey: ["comments", postId]
            });
        },

        onError: function (error) {

            console.log(
                "DELETE ERROR:",
                error.response?.data || error
            );
        }
    });



    let {
        mutate: editComment,
        isPending: isEditing
    } = useMutation({

        mutationFn: function ({ commentId, content }) {

            return axios.put(
                `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
                {
                    content: content
                },
                {
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem("token")
                    }
                }
            );
        },

        onSuccess: function (data) {

            console.log("EDIT:", data);

            setEditingCommentId(null);
            setEditContent("");

            queryclient.invalidateQueries({
                queryKey: ["comments", postId]
            });
        },

        onError: function (error) {

            console.log(
                "EDIT ERROR:",
                error.response?.data || error
            );
        }
    });



    if (isLoading) {

        return (
            <div className="flex justify-center py-10">

                <ClipLoader
                    color="#36d7b7"
                    size={47}
                    speedMultiplier={0.55}
                />

            </div>
        );
    }


    return (

        <div>

            {comments.map(function (comment) {


                let isMyComment =
                    currentUser?._id === comment.commentCreator?._id;


                return (

                    <div
                        key={comment._id}
                        className="comment mt-3 mb-4 bg-blue-500 rounded-md p-5"
                    >

                        <div className="flex justify-between items-center">

                            <div className="flex items-center">

                                <Avatar size="lg">

                                    <Avatar.Image
                                        alt="User"
                                        src={comment.commentCreator.photo}
                                    />

                                </Avatar>

                                <div className="name px-4">

                                    <p>
                                        {comment.commentCreator.name}
                                    </p>

                                    <p>
                                        {comment.createdAt}
                                    </p>

                                </div>

                            </div>




                            {isMyComment && (

                                <Dropdown>

                                    <Button
                                        aria-label="Menu"
                                        variant="secondary"
                                    >
                                        ...
                                    </Button>


                                    <Dropdown.Popover>

                                        <Dropdown.Menu
                                            onAction={(key) => {

                                                if (key === "edit") {

                                                    setEditingCommentId(
                                                        comment._id
                                                    );

                                                    setEditContent(
                                                        comment.content || ""
                                                    );
                                                }


                                                if (key === "delete") {

                                                    deleteComment(
                                                        comment._id
                                                    );
                                                }

                                            }}
                                        >

                                            <Dropdown.Item
                                                id="edit"
                                                textValue="Edit"
                                            >
                                                <Label>
                                                    Edit
                                                </Label>
                                            </Dropdown.Item>


                                            <Dropdown.Item
                                                id="delete"
                                                textValue="Delete"
                                                variant="danger"
                                            >
                                                <Label>
                                                    Delete
                                                </Label>
                                            </Dropdown.Item>

                                        </Dropdown.Menu>

                                    </Dropdown.Popover>

                                </Dropdown>

                            )}

                        </div>



                        <div className="mt-3">


                            {editingCommentId === comment._id ? (

                                <div className="flex gap-2">

                                    <Input
                                        value={editContent}
                                        onChange={(e) =>
                                            setEditContent(e.target.value)
                                        }
                                    />

                                    <Button
                                        onClick={() =>
                                            editComment({
                                                commentId: comment._id,
                                                content: editContent
                                            })
                                        }
                                        isDisabled={
                                            isEditing ||
                                            !editContent.trim()
                                        }
                                    >
                                        {isEditing
                                            ? "Saving..."
                                            : "Save"}
                                    </Button>


                                    <Button
                                        onClick={() => {

                                            setEditingCommentId(null);
                                            setEditContent("");

                                        }}
                                    >
                                        Cancel
                                    </Button>

                                </div>

                            ) : (

                                <>
                                    {comment.content ? (
                                        <p>
                                            {comment.content}
                                        </p>
                                    ) : null}


                                    {comment.image ? (

                                        <img
                                            src={comment.image}
                                            alt=""
                                            className="mt-3 w-40 rounded-xl"
                                        />

                                    ) : null}

                                </>

                            )}

                        </div>

                    </div>

                );

            })}

        </div>
    );
}