import { Editor } from "@tiptap/react";
import { useState } from "react";
import { Button } from "@/primitives/Button";
import { Input } from "@/primitives/Input";
import { Popover } from "@/primitives/Popover";
import { Code2Icon, ImageIcon, UploadCloudIcon } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import { ImageAligner } from "@harshtalks/image-tiptap";
import axios from "axios";
import { useToast } from "./ui/use-toast";

type Props = {
  editor: Editor;
};

export function ToolbarMedia({ editor }: Props) {
  function addImage(url: string) {
    if (!url.length) {
      return;
    }

    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }

  function addYouTube(url: string) {
    if (!url.length) {
      return;
    }

    editor.chain().setYoutubeVideo({ src: url }).run();
  }
  const {toast} = useToast();
  return (
    <>
      <Button className="p-2 rounded-md hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50" onClick={() => {
        // prompt user to upload image
        const input=document.createElement('input') as HTMLInputElement;
        input.type='file';
        input.accept='image/*';
        input.click();
        input.addEventListener('change',()=>{
          const file=input.files?.[0];
          if(file){
            //upload the file to the server
            toast({
              title:'Uploading image',
              description:'Please wait while the image is being uploaded',
              duration:5000
            })
            const formData=new FormData();
            formData.append('image',file);
            axios.post('/api/upload-image',formData)
            .then((response)=>{
              const imageUrl=response.data.url as string;
              console.log('Image uploaded',imageUrl);
              addImage(imageUrl);
            })
            .catch((error)=>{
              console.error('Failed to upload image',error);
              toast({
                title:'Failed to upload image',
                variant:'destructive',
                description:'Please try again later'
              })
            });
          }
        })
      }} >
        <UploadCloudIcon className="w-5 h-5" />
      </Button>

      <Button
        className="p-2 rounded-md hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50"
        variant="subtle"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
        data-active={editor.isActive("codeBlock") ? "is-active" : undefined}
        aria-label="Code block"
      >
        <Code2Icon className="w-5 h-5" />
      </Button>

      <Popover content={<MediaPopover variant="image" onSubmit={addImage} />}>
        <Button
          className="p-2 rounded-md hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50"
          variant="subtle"
          disabled={!editor.can().chain().setImage({ src: "" }).run()}
          data-active={editor.isActive("image") ? "is-active" : undefined}
          aria-label="Image"
        >
          <ImageIcon className="w-5 h-5" />
        </Button>
      </Popover>
      <div>
        <ImageAligner.Root editor={editor}>
          <ImageAligner.AlignMenu>
            <ImageAligner.Items className="flex space-x-2 bg-white border border-gray-300 shadow-lg rounded-lg p-2">
              <ImageAligner.Item
                alignment="left"
                className="px-4 py-2 rounded-md transition-all hover:bg-gray-100 active:bg-gray-200"
              >
                Left
              </ImageAligner.Item>
              <ImageAligner.Item
                alignment="center"
                className="px-4 py-2 rounded-md transition-all hover:bg-gray-100 active:bg-gray-200"
              >
                Center
              </ImageAligner.Item>
              <ImageAligner.Item
                alignment="right"
                className="px-4 py-2 rounded-md transition-all hover:bg-gray-100 active:bg-gray-200"
              >
                Right
              </ImageAligner.Item>
            </ImageAligner.Items>
          </ImageAligner.AlignMenu>
        </ImageAligner.Root>
      </div>



      <Popover content={<MediaPopover variant="youtube" onSubmit={addYouTube} />}>
        <Button
          className="p-2 rounded-md hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50"
          variant="subtle"
          disabled={!editor.can().chain().setImage({ src: "" }).run()}
          data-active={editor.isActive("youtube") ? "is-active" : undefined}
          aria-label="YouTube"
        >
          <FaYoutube className="w-5 h-5" />
        </Button>
      </Popover>
    </>
  );
}

type MediaPopoverProps = {
  variant: "image" | "youtube";
  onSubmit: (url: string) => void;
};

function MediaPopover({ variant, onSubmit }: MediaPopoverProps) {
  const [value, setValue] = useState("");

  return (
    <form
      className="space-y-3 p-4 max-w-xs w-full bg-white rounded-lg shadow-lg"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}
    >
      <label className="block text-sm font-medium text-gray-700" htmlFor="">
        Add {variant === "image" ? "image" : "YouTube"} URL
      </label>
      <div className="flex space-x-2">
        <Input
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Add {variant === "image" ? "image" : "video"}
        </Button>
      </div>
    </form>
  );
}
