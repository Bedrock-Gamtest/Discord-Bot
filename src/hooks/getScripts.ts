import axios from "axios";
import { GITHUB_PROFILE } from "../../config.json" assert { type: "json" };

export default async function getScripts(): Promise<any> {
    return await axios.get("https://api.github.com/users/" + GITHUB_PROFILE + "/received_events")
    .then((res) => res.data)
    .catch();
}