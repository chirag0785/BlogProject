import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "./ui/use-toast"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import axios from "axios"
const grantAccessSchema = z.object({
  shareOption: z.enum(["anyone", "specific"]),
})

export default function ShareOptions({ roomId }: { roomId: string }) {
  const { toast } = useToast();
  const [emails, setEmails] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [searchEmails, setSearchEmails] = useState<string[]>([]);
  const debounced = useDebounceCallback(setEmail, 1000)
  const form = useForm<z.infer<typeof grantAccessSchema>>({
    resolver: zodResolver(grantAccessSchema),
    defaultValues: {
      shareOption: "anyone",
    },
  })

  useEffect(() => {
    if (email && email.length > 0) {
      axios.get('/api/search-users/?email=' + email)
        .then((response) => {
          return response.data
        })
        .then((data) => {
          setSearchEmails(data.emails);
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }, [email])
  function onSubmit(data: z.infer<typeof grantAccessSchema>) {
    axios.post(`/api/update-access/${roomId}`,{
      shareOption:data.shareOption,
      emails
    })
      .then((response) => {
        return response.data
      })
      .then((data) => {
        toast({
          title: "Success",
          description: "Access granted successfully",
        });
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error",
          description: err?.response?.data?.message || err.message || "Unknown error occurred",
          variant: "destructive",
        });
      })
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
          <FormField
            control={form.control}
            name="shareOption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Share Option</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="anyone">Anyone with the link</SelectItem>
                    <SelectItem value="specific">Grant access to specific users</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("shareOption") === "specific" && (
            <div>
              <h3>Enter Email Id of user</h3>
              <input type="text" onChange={(e) => debounced(e.target.value)} className="border border-gray-300 rounded-md p-2"/>

              {searchEmails && searchEmails.length==0 && (
                <div>
                  <p>No user found</p>
                </div>
              )}
              <ul>
                {searchEmails.length>0 && searchEmails.map((email) => (
                  <li key={email} onClick={() => setEmail(email)} className="cursor-pointer">{email}</li>
                ))}
              </ul>


              <h3>Selected Emails</h3>
              <ul>
                {emails.map((email) => (
                  <li key={email}>{email}</li>
                ))}
              </ul>
              <button onClick={() => {
                setEmails((prev) => [...prev, email]);
                setEmail('');
              }} type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">Add</button>
            </div>
          )}
          <Button type="submit">Apply</Button>
        </form>
      </Form>
    </>
  );
}
