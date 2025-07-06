import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import Loading from "../../Components/Loading";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const CompletedDeleveries = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: completedDelivery = [], isLoading } = useQuery({
    queryKey: ["completedDelivery", user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(
        `/completed/delivery?email=${user?.email}`
      );
      return response.data;
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  console.log(completedDelivery);

  return <div></div>;
};

export default CompletedDeleveries;
