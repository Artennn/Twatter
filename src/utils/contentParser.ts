export interface ParsedContent {
    type: "text" | "@" | "#" | "link" | "image",
    text: string,
}

export const parseContent = (raw: string): ParsedContent[] => {
    const result: ParsedContent[] = [];
    const words = raw.replaceAll("\n", " \n ").split(" ");

    for(let word of words) {
        let type: ParsedContent["type"] = "text";
        if (word.startsWith("@")) type = "@";
        if (word.startsWith("#")) type = "#";
        if (word.startsWith("https:")) type = "link";
        if (word.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/)) type = "image";

        if (type === "text") {
            if (result[result.length - 1]?.type === "text") {
                const last = result.pop();
                word = last?.text + " " + word;
            }
        }
        result.push({
            type,
            text: word,
        })
    }
    return result;
}