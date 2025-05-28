import Login from "@/components/LoginPage"
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
function page (){
    return (
        <div>
          
            <BackgroundBeamsWithCollision >
            <Login />
            </BackgroundBeamsWithCollision>
        </div>
    )
}

export default page