
import { Button, Input } from "@heroui/react";
import { useRef, useState } from "react";

import { CloseButton } from "@heroui/react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";


export default function CreateComment({ postId }) {

    let queryclient = useQueryClient()


    let { isPending, mutate } = useMutation({
        mutationFn: handleCreateComment,

        onSuccess: function () {

            queryclient.invalidateQueries({
                queryKey: ["comments", postId],
            });

            Commentcontent.current.value = "";
            CommentImage.current.value = "";

            setImageUrl(null);
            setImage("");
        }
    });

    const [ImageUrl, setImageUrl] = useState(null);
    const [Image, setImage] = useState("");

    let Commentcontent = useRef(null);
    let CommentImage = useRef(null);
    function handleCreateComment() {


        let formData = new FormData();

        let content = Commentcontent.current.value;
        let image = CommentImage.current.files[0];

        if (content) {
            formData.append("content", content);
        }

        if (image) {
            formData.append("image", image);
        }

        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        return axios.post(
            `https://route-posts.routemisr.com/posts/${postId}/comments`,
            formData,
            {
                headers: {
                    Authorization:
                        "Bearer " + localStorage.getItem("token")
                }
            }
        )


    }

    function HandleImg() {

        let file = CommentImage.current.files[0];

        if (!file) return;

        let url = URL.createObjectURL(file);

        setImageUrl(url);
        setImage(file);
    }

    function closeimg() {
        setImageUrl(null);
        CommentImage.current.value = "";
        setImage("");
    }

    return (
        <div className="mt-6 bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">

            <h3 className="text-lg font-semibold text-blue-700 mb-4">
                Add a Comment
            </h3>

            <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">

                <Input
                    ref={Commentcontent}
                    type="text"
                    placeholder="Write your comment..."
                    fullWidth={true}
                    className="my-3"
                    classNames={{
                        inputWrapper:
                            "bg-blue-50 border border-blue-100 hover:border-blue-300 focus-within:border-blue-500 rounded-xl",
                        input: "text-gray-700 placeholder:text-gray-400"
                    }}
                />

                {ImageUrl && (
                    <div className="flex flex-col items-center justify-center gap-4">

                        <CloseButton
                            aria-label="Close"
                            onClick={closeimg}
                        />

                        <img
                            src={ImageUrl}
                            alt=""
                            className="w-40 h-40 object-cover rounded-xl"
                        />

                    </div>
                )}

                <Input
                    onChange={HandleImg}
                    ref={CommentImage}
                    type="file"
                    accept="image/*"
                    fullWidth={true}
                    className="my-3"
                    classNames={{
                        inputWrapper:
                            "bg-blue-50 border border-blue-100 hover:border-blue-300 focus-within:border-blue-500 rounded-xl",
                        input: "text-gray-700"
                    }}
                />

                <div className="flex justify-center mt-4">

                    <Button
                        onClick={mutate}
                        className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl px-8"
                    >
                        {isPending ? <div className="h-screen flex justify-center items-center">
                            <ClipLoader
                                color="#36d7b7"
                                size={47}
                                speedMultiplier={0.55}
                            />
                        </div> : "comment"}
                    </Button>

                </div>

            </div>
        </div>
    );
}

