import { ChangeEvent, useState } from "react";

export default function SettingsGame(){
  
  //state
    //ball speed 5-10
    // size 3-20
    //color
  //behaviour
  const [showModal, setShowModal] = useState(false);
    const [ speed, setSpeed] = useState<number>(1);
    const [ size, setSize] = useState<number>(1);
  //render

  const handleSpeed = (e: ChangeEvent<HTMLInputElement>) => {
    setSpeed(e.target.valueAsNumber);
  }

  const handleSize = (e: ChangeEvent<HTMLInputElement>) => {
    setSize(e.target.valueAsNumber);
  }
  
  return (
    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <div className="fixed inset-0 bg-gray-500 bg-opacity-60 transition-opacity"></div>

  <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <div className="bg-gray-500 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-base items-center font-semibold leading-6 text-gray-900" id="modal-title">Game Settings</h3>
            </div>
          </div>
        </div>
        <div className="bg-gray-600 text-black">
        <div>
            <div>
                <label className="mb-2 inline-block">
                    Ball speed : {speed}
                </label>
            </div>
            <input
                type="range"
                className="transparent h-[4px] w-full cursor-pointer rounded
            appearance-none border-transparent bg-neutral-200 dark:bg-neutral-600 w-40"
                min="1"
                max="5"
                id="ballSpeed"
                onChange={handleSpeed}
                defaultValue="1"
                value={speed}/>
            </div>
            <div>
            <div>
                <label className="mb-2 inline-block">
                    Ball size : {size}
                </label>
            </div>
            <input
                type="range"
                className="transparent h-[4px] w-full cursor-pointer rounded
            appearance-none border-transparent bg-neutral-200 dark:bg-neutral-600 w-40"
                min="1"
                max="17"
                id="ballSize"
                onChange={handleSize}
                defaultValue="1"
                value={size}/>
            </div>
            <div>
                Color racket :
                <div className="grid grid-cols-6 gap-2">
                    <div className="flex items-center mr-4">
                        <input id="red-radio" type="radio" value="red" name="color" className="w-10 h-10 text-red-600 bg-red-500 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                    </div>
                    <div className="flex items-center mr-4">
                        <input id="green-radio" type="radio" value="green" name="color" className="w-10 h-10 text-green-600 bg-green-500 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                    </div>
                    <div className="flex items-center mr-4">
                        <input id="purple-radio" type="radio" value="purple" name="color" className="w-10 h-10 text-purple-600 bg-purple-500 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div className="flex items-center mr-4">
                        <input id="teal-radio" type="radio" name="color" value="teal" className="w-10 h-10 text-teal-600 bg-teal-500 border-gray-300 rounded focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div className="flex items-center mr-4">
                        <input id="yellow-radio" type="radio" name="color" value="yellow" className="w-10 h-10 text-yellow-400 bg-yellow-500 border-gray-300 rounded focus:ring-yellow-500 dark:focus:ring-yellow-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div className="flex items-center mr-4">
                        <input id="orange-radio" type="radio" name="color" value="orange" className="w-10 h-10 text-orange-500 bg-orange-500 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                </div>
            </div>
        </div>
        <div className="bg-gray-400 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button type="button" className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">Submit</button>
          <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</div>
    );
};

