import { title, subtitle } from "@/components/primitives";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <div className="inline-block max-w-lg text-center justify-center">
                <h1 className={title()}>Jin's&nbsp;</h1>
                <h1 className={title({ color: "violet" })}>TODO APP&nbsp;</h1>
                <br />
                <h1 className={title()}>Welcome and Enjoy!&#39;s</h1>
            </div>
            <div></div>
        </section>
    );
}
