import { cohere } from "@/utils/cohere";

export async function GET(request: Request, route: { params: { topicName: string } }) {
    const { topicName } = route.params;
    try {
        const response = await cohere.chat({
            model: 'command-a-03-2025',
            messages: [
                {
                    role: 'user',
                    content: `Generate exactly 10 creative and trendy blog title ideas for the topic: "${topicName}".
Rules:
- Do NOT include numbering, bullet points, or quotation marks.
- Each title must be under 12 words.
- Titles should sound natural, catchy, and reflect current trends in ${topicName}.
- Avoid repetition and generic phrases.
- Only return the 10 titles separated by || (no extra text, no formatting).

Example Output:
Title idea one || Title idea two || Title idea three ...`
                }
            ],
            temperature: 0.7,
        }, { timeoutInSeconds: 10 });

        return Response.json({
            success: true,
            message: "Suggested headings fetched success",
            suggestedHeadings: (response.message?.content) ? (response.message?.content[0].text) : "No headings found",
        }, { status: 200 })
    } catch (err) {
        console.error(err);
        return Response.json({
            success: false,
            message: "Internal server error while fetching suggested messages",
        }, { status: 500 })
    }
}