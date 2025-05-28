import Chat from "@/components/Chat";

export default function chatPage (){
    return (
    <>
        <div className=" text-white min-h-[78vh] mt-36 w-full">
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Chat Application</h1>
        <Chat />
      </div>
    </div>
    </>
    )
}