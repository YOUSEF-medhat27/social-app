import { Button, TextArea } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRef, useState } from "react";

export default function CreatePost() {

    let queryclient = useQueryClient();

    const [ImageUrl, setImageUrl] = useState(null);
    const [Image, setImage] = useState("");

    let PostBody = useRef(null);
    let PostImage = useRef(null);


   
    function handleCreatePost() {

        let formData = new FormData();

        let content = PostBody.current.value;
        let image = PostImage.current.files[0];

        if (content) {
            formData.append("body", content);
        }

        if (image) {
            formData.append("image", image);
        }

        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        return axios.post(
            "https://route-posts.routemisr.com/posts",
            formData,
            {
                headers: {
                    Authorization:
                        "Bearer " + localStorage.getItem("token")
                }
            }
        );
    }



    let { isPending, mutate } = useMutation({

        mutationFn: handleCreatePost,

        onSuccess: function (data) {

            console.log("POST CREATED:", data);

            queryclient.invalidateQueries({
                queryKey: ["Posts"]
            });

            PostBody.current.value = "";
            PostImage.current.value = "";

            setImageUrl(null);
            setImage("");
        },

        onError: function (error) {

            console.log(
                "CREATE POST ERROR:",
                error.response?.data || error
            );

        }
    });

    function HandleImg() {

        let file = PostImage.current.files[0];

        if (!file) return;

        let url = URL.createObjectURL(file);

        setImageUrl(url);
        setImage(file);
    }


    function closeimg() {

        setImageUrl(null);
        PostImage.current.value = "";
        setImage("");
    }


    return (

        <div className="mt-6 bg-white w-[60%] mx-auto border border-blue-100 rounded-2xl p-5 shadow-sm">

            <h3 className="text-lg font-semibold text-blue-700 mb-4">
                Add a post
            </h3>

            <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">

                <TextArea
                    ref={PostBody}
                    placeholder="Write your Post..."
                    fullWidth={true}
                    className="my-3 py-5"
                    classNames={{
                        inputWrapper:
                            "bg-blue-50 border border-blue-100 hover:border-blue-300 focus-within:border-blue-500 rounded-xl",

                        input:
                            "text-gray-700 placeholder:text-gray-400"
                    }}
                />


                {/* IMAGE */}

                <div className="flex items-center justify-center w-full">

                    <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-64 bg-neutral-secondary-medium border border-dashed border-default-strong rounded-base cursor-pointer hover:bg-neutral-tertiary-medium"
                    >

                        <div className="flex flex-col items-center justify-center text-body pt-5 pb-6">

                            <p className="mb-2 text-sm">
                                <span className="font-semibold">
                                    Click to upload
                                </span>{" "}
                                or drag and drop
                            </p>

                            <p className="text-xs">
                                SVG, PNG, JPG or GIF
                            </p>

                        </div>


                        <input
                            ref={PostImage}
                            id="dropzone-file"
                            type="file"
                            accept="image/*"
                            onChange={HandleImg}
                            className="hidden"
                        />

                    </label>

                </div>

                {ImageUrl && (

                    <div className="mt-4 flex flex-col items-center">

                        <img
                            src={ImageUrl}
                            alt=""
                            className="w-40 h-40 object-cover rounded-xl"
                        />

                        <Button
                            onClick={closeimg}
                            className="mt-3"
                        >
                            Remove Image
                        </Button>

                    </div>

                )}

                <div className="flex justify-center mt-4">

                    <Button
                        onClick={mutate}
                        isDisabled={isPending}
                        className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl px-8"
                    >

                        {isPending ? "Posting..." : "Post"}

                    </Button>

                </div>

            </div>

        </div>
    );
}
