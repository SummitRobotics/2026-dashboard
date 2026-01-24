export default function Builder() {
    return(
        <div className="h-25 w-full">
            <div className="float-left border border-red-400 h-full w-99/200 rounded-sm">
                <div className="flex justify-evenly m-9.5">
                    <select name="r1" id="r1" className="">
                        <option value="5468">5468</option>
                    </select>
                    <select name="r2" id="r2" className="">
                        <option value="5468">5468</option>
                    </select>
                    <select name="r3" id="r3" className="">
                        <option value="5468">5468</option>
                    </select>
                </div>
            </div>
            <div className="float-right border border-blue-400 h-full w-99/200 rounded-sm">
                <div className="flex justify-evenly m-9.5">
                    <select name="b1" id="b1" className="">
                        <option value="5468">5468</option>
                    </select>
                    <select name="b2" id="b2" className="">
                        <option value="5468">5468</option>
                    </select>
                    <select name="b3" id="b3" className="">
                        <option value="5468">5468</option>
                    </select>
                </div>
            </div>
        </div>
    )
}