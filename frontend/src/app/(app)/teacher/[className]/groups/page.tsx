"use client"

export default function GroupPage () {
    return (
        <>
            <div className="mt-40">
                <h2 className="text-center text-2xl">Groups in your class with their frequency</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 p-6">

                    {/* Group 1 */}
                    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">Group (Frequency 3)</h3>
                        <ul className="mb-4">
                            <li>arijit: <span className="text-green-400">Good Student</span></li>
                            <li>abhisri: <span className="text-yellow-400">Moderate Attention</span></li>
                        </ul>
                        <p className="text-sm">
                            Action: This group includes both good students and those requiring moderate attention. Assign tasks that challenge the more attentive students while encouraging moderate attention students to stay focused.
                        </p>
                    </div>

                    {/* Group 2 */}
                    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">Group (Frequency 2)</h3>
                        <ul className="mb-4">
                            <li>priyam: <span className="text-green-400">Good Student</span></li>
                            <li>abhisri: <span className="text-yellow-400">Moderate Attention</span></li>
                        </ul>
                        <p className="text-sm">
                            Action: This group includes both good students and those requiring moderate attention. Assign tasks that challenge the more attentive students while encouraging moderate attention students to stay focused.
                        </p>
                    </div>

                    {/* Group 3 */}
                    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">Group (Frequency 1)</h3>
                        <ul className="mb-4">
                            <li>ankan: <span className="text-yellow-400">Moderate Attention</span></li>
                            <li>debajit: <span className="text-yellow-400">Moderate Attention</span></li>
                        </ul>
                        <p className="text-sm">
                            Action: All students require moderate attention. It is suggested to monitor their engagement and occasionally offer additional guidance.
                        </p>
                    </div>

                    {/* Group 4 (Including a Bad Student) */}
                    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">Group (Frequency 1)</h3>
                        <ul className="mb-4">
                            <li>arijit: <span className="text-red-400">Needs Improvement</span></li>
                            <li>priyam: <span className="text-green-400">Good Student</span></li>
                        </ul>
                        <p className="text-sm">
                            Action: arijit needs extra attention and possibly intervention to improve his performance. Consider one-on-one mentoring sessions or additional support.
                        </p>
                    </div>

                    {/* Group 5 */}
                    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">Group (Frequency 1)</h3>
                        <ul className="mb-4">
                            <li>ankan: <span className="text-yellow-400">Moderate Attention</span></li>
                            <li>arijit: <span className="text-green-400">Good Student</span></li>
                        </ul>
                        <p className="text-sm">
                            Action: This group includes both good students and those requiring moderate attention. Assign tasks that challenge the more attentive students while encouraging moderate attention students to stay focused.
                        </p>
                    </div>

                    {/* Group 6 (Another Bad Student Example) */}
                    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">Group (Frequency 2)</h3>
                        <ul className="mb-4">
                            <li>debajit: <span className="text-yellow-400">Moderate Attention</span></li>
                            <li>priyam: <span className="text-red-400">Needs Improvement</span></li>
                        </ul>
                        <p className="text-sm">
                            Action: priyam needs improvement. You may want to provide more guidance and consider holding study sessions to improve his performance.
                        </p>
                    </div>

                </div>
            </div>
        </>
    )
}
