"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import blogs from "../../blogs.json";
import Autoplay from "embla-carousel-autoplay"
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
const Page = () => {
  return (
    <>
    <Navbar/>
    <div className="relative bg-gray-800 text-white min-h-screen">
      
      <section className="py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">
            Create and Share Your Blogs Effortlessly
          </h2>
          <p className="text-lg mb-6">
            Blog Creator - Empowering you to write, publish, and share your stories with ease.
          </p>
          <Link href="/sign-in" className="inline-block bg-blue-500 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300">
            Start Your Journey
          </Link>
        </div>
      </section>

      
      <div className="relative w-full max-w-3xl mx-auto mt-16">
        <Carousel className="w-full" plugins={[
          Autoplay({
            delay: 2000
          })
        ]}>
          <CarouselContent className="flex">
            {blogs.map((blog) => (
              <CarouselItem
                key={blog.id}
                className="flex-shrink-0 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-lg"
              >
                <Card className="bg-gray-700 border border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">{blog.heading}</CardTitle>
                    <CardDescription className="text-gray-300">{blog.topic}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-200">by {blog.username}</p>
                  </CardContent>
                  <CardFooter>
                    <p className="text-gray-400">{blog.likes} likes</p>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          
        </Carousel>
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default Page;
