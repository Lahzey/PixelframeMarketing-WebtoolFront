import {atom, selector, useRecoilState} from "recoil";
import {fetchTags, fetchUser, getToken, getUserIdFromToken} from "./apiRequests";

const initialUserSelector = selector({
    key: "initialUserSelector",
    get: async () => {
        const token = getToken();
        if (!token) return null;

        try {
            const response = await fetchUser(getUserIdFromToken(token));
            return response.data;
        } catch (e) {
            return null;
        }
    },
});

export const USER = atom({
    key: "user",
    default: initialUserSelector
});

const TAGS_DATA = atom({
   key: "tagsData",
   default: {
       value: [],
       isFetching: false,
       expirationTime: 0
   } 
});

export function useAllTags() {
    const [tagsData, setTagsData] = useRecoilState(TAGS_DATA);
    const currentTime = new Date().getTime();
    
    if (!tagsData.isFetching && tagsData.expirationTime <= currentTime) {
        setTagsData({...tagsData, isFetching: true});
        fetchTags().then(response => {
            setTagsData({value: response.data, expirationTime: new Date().getTime() + 30 * 60 * 1000, isFetching: false});
        }).catch(error => {
            console.log("Error fetching tags:");
            console.log(error);
            setTagsData({value: tagsData.value, expirationTime: new Date().getTime() + 1000, isFetching: false}); // must wait at least 1 sec before making another attempt
        });
    }
    
    return tagsData.value;
}