"use client"
import { Editor} from "@tinymce/tinymce-react";
import axios from "axios";
type BlogEditorProps = {
  value: string;
  onChange: (content: string) => void;
  setWordCount: (count: number) => void;
};
const BlogEditor: React.FC<BlogEditorProps> = ({ value, onChange, setWordCount }) => {
  const handleEditorChange = (newContent:string, editor:any) => {
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
        plugins: 'anchor autolink charmap emoticons image link lists media searchreplace table visualblocks wordcount code',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table code | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat | wordcount',
        images_upload_handler:(blobInfo, progress) => new Promise((resolve, reject) => {
          const formData=new FormData();
          formData.append('image',blobInfo.blob(),blobInfo.filename());
             axios.post('/api/upload-image',formData)
              .then((response)=>{
                return response.data;
              })
              .then((data)=>{
                resolve(data.url);
              })
              .catch((err)=>{
                reject(err)
              })
        }),
        paste_data_images:true
      }}
      initialValue="Welcome to Blog Editor!"
    />
    </>
  )
}

export default BlogEditor;
