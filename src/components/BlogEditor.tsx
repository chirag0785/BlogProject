"use client";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";

type BlogEditorProps = {
  value: string;
  onChange: (content: string) => void;
  setWordCount: (count: number) => void;
};

const BlogEditor: React.FC<BlogEditorProps> = ({ value, onChange, setWordCount }) => {
  const handleEditorChange = (newContent: string, editor: any) => {
    onChange(newContent);
    const wordCount = editor.plugins.wordcount.getCount();
    setWordCount(wordCount);
  };



  return (
    <>
      <Editor
        id="abc123"
        onEditorChange={handleEditorChange}
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        init={{
          plugins: 'anchor autolink charmap emoticons image link lists searchreplace table visualblocks wordcount code codesample',
          toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image table code | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat | wordcount | add-video | codesample code',
          images_upload_handler: (blobInfo, progress) => new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('image', blobInfo.blob(), blobInfo.filename());
            axios.post('/api/upload-image', formData)
              .then((response) => {
                return response.data;
              })
              .then((data) => {
                resolve(data.url);
              })
              .catch((err) => {
                reject(err);
              });
          }),
          paste_data_images: true,
          setup: (editor) => {
            editor.ui.registry.addButton('add-video', {
              icon: 'video',
              tooltip: 'Insert Video',
              onAction: () => {
                //hidden input
                let input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'video/*');
                input.click();
                input.onchange = (e: any) => {
                  const file = e.target.files[0];
                  if (file) {
                    const formData = new FormData();
                    formData.append('video', file);

                    axios.post('/api/upload-video', formData)
                      .then((response) => {
                        return response.data;
                      })
                      .then((data) => {
                        editor.insertContent(`<video src="${data.url}" controls></video>`);
                        editor.notificationManager.open({
                          text: 'Video uploaded successfully!',
                          type: 'success'
                        });
                      })
                      .catch((err) => {
                        console.error(err);
                        editor.notificationManager.open({
                          text: 'Failed to upload video. Please try again.',
                          type: 'error'
                        });
                      })
                  }
                }
              }
            });
          },
          codesample_language: [
            { text: 'HTML/XML', value: 'markup' },
            { text: 'JavaScript', value: 'javascript' },
            { text: 'CSS', value: 'css' },
            { text: 'PHP', value: 'php' },
            { text: 'Ruby', value: 'ruby' },
            { text: 'Python', value: 'python' },
            { text: 'Java', value: 'java' },
            { text: 'C', value: 'c' },
            { text: 'C#', value: 'csharp' },
            { text: 'C++', value: 'cpp' }
          ],
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
        }}
        initialValue="Welcome to Blog Editor!"
      />
    </>
  );
};

export default BlogEditor;
