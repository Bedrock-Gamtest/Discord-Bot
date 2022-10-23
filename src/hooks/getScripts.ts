import axios from "axios";

export default async function getScripts(): Promise<any> {
    return await axios.get("https://api.github.com/users/" + "/received_events")
    .then((res) => res.data)
    .catch();
}
