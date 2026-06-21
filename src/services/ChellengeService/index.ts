import { getData, patchData } from "../api";

export const fetchChellenges = async () => {
  const data = await getData("/chellenges");
  return data;
};

export const fetchChellenge = async (id: string) => {
  const data = await getData(`/chellenges/${id}`);
  return data;
};

export const completeChallenge = async (
  userId: string,
  challengeId: number,
) => {
  const data = await patchData("/chellenges/complete", {
    userId,
    challengeId,
  });
  return data;
};
