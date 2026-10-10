
import axios from "axios";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Avatar, Button } from "@heroui/react";
import { ClipLoader } from "react-spinners";

const BASE_URL = "https://route-posts.routemisr.com";

function authHeaders() {
    return {
        Authorization: "Bearer " + localStorage.getItem("token"),
    };
}

export default function FollowSuggestions() {
    const [showAll, setShowAll] = useState(false);
    const [followedIds, setFollowedIds] = useState([]);
    const [pendingId, setPendingId] = useState(null);

    function getSuggestions() {
        return axios.get(`${BASE_URL}/users/suggestions?limit=10`, {
            headers: authHeaders(),
        });
    }

    const { data, isLoading, isError } = useQuery({
        queryKey: ["followSuggestions"],
        queryFn: getSuggestions,
    });

    const suggestions = data?.data?.data?.suggestions || [];
    const visibleSuggestions = showAll
        ? suggestions
        : suggestions.slice(0, 5);

    const { mutate: followUser } = useMutation({
        mutationFn: function (userId) {
            return axios.put(
                `${BASE_URL}/users/${userId}/follow`,
                {},
                { headers: authHeaders() }
            );
        },

        onMutate: function (userId) {
            setPendingId(userId);
        },

        onSuccess: function (_, userId) {
            setFollowedIds((prev) =>
                prev.includes(userId) ? prev : [...prev, userId]
            );
        },

        onError: function (error) {
            console.log("FOLLOW ERROR:", error.response?.data || error);
        },

        onSettled: function () {
            setPendingId(null);
        },
    });

    return (
        <section className="w-full rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-2">
                <h2 className="text-lg font-bold text-[#102654]">
                    People you may know
                </h2>

                {suggestions.length > 5 && (
                    <button
                        type="button"
                        onClick={() => setShowAll((prev) => !prev)}
                        className="shrink-0 text-xs font-medium text-blue-600 transition hover:text-blue-800"
                    >
                        {showAll ? "Show less" : "See all"}
                    </button>
                )}
            </div>

            {isLoading && (
                <div className="flex justify-center py-8">
                    <ClipLoader color="#2875ff" size={30} />
                </div>
            )}

            {isError && (
                <p className="py-5 text-center text-sm text-red-500">
                    Couldn't load suggestions. Try again later.
                </p>
            )}

            {!isLoading && !isError && suggestions.length === 0 && (
                <p className="py-5 text-center text-sm text-gray-500">
                    No suggestions right now.
                </p>
            )}

            {!isLoading && !isError && visibleSuggestions.length > 0 && (
                <div className="flex flex-col gap-5">
                    {visibleSuggestions.map((user) => {
                        const isFollowed = followedIds.includes(user._id);
                        const isPending = pendingId === user._id;

                        return (
                            <div
                                key={user._id}
                                className="flex items-center justify-between gap-3"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <Avatar
                                        size="lg"
                                        className="h-12 w-12 shrink-0"
                                    >
                                        <Avatar.Image
                                            alt={user.name || "User"}
                                            src={user.photo}
                                        />
                                        <Avatar.Fallback>
                                            {user.name?.charAt(0) || "U"}
                                        </Avatar.Fallback>
                                    </Avatar>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-[#102654]">
                                            {user.name}
                                        </p>

                                        <p className="mt-1 truncate text-xs text-[#7185a8]">
                                            @{user.username}
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    size="sm"
                                    onPress={() => followUser(user._id)}
                                    isDisabled={isFollowed || isPending}
                                    className={`h-8 min-w-19 shrink-0 rounded-xl px-4 text-xs font-semibold ${
                                        isFollowed
                                            ? "bg-blue-50 text-blue-600"
                                            : "bg-[#2875ff] text-white hover:bg-blue-700"
                                    }`}
                                >
                                    {isFollowed
                                        ? "Following"
                                        : isPending
                                          ? "..."
                                          : "Follow"}
                                </Button>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
