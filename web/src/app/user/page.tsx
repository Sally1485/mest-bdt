import Image from "next/image";

export default function UserProfilePage() {
  return (
    <div className="p-6 sm:p-10 min-h-screen bg-gray-100 dark:bg-[#0b0c10] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">User Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          View and edit your personal information
        </p>
      </div>

      <div className="bg-white dark:bg-[#1a1d24] shadow rounded-2xl p-6 sm:p-10 flex flex-col sm:flex-row gap-8">
        {/* IMAGE SECTION */}
        <div className="flex flex-col items-center sm:items-start sm:w-1/3">
          <div className="relative w-32 h-32 sm:w-48 sm:h-48 rounded-full sm:rounded-lg overflow-hidden shadow">
            <Image
              src="https://i.pinimg.com/1200x/b2/db/80/b2db80290f2aba3567213d4eab1117a5.jpg"
              alt="User Avatar"
              fill
              className="object-cover"
            />
          </div>

          {/* Change Avatar Button */}
          <button
            type="button"
            className="mt-4 text-sm bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Change Avatar
          </button>
        </div>

        {/* USER INFORMATION */}
        <div className="flex-1 space-y-8">
          <div>
            <h2 className="text-xl font-semibold">Coco Jones</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              cocojones123@gmail.com
            </p>
          </div>

          <div className="border-b dark:border-gray-700 flex gap-6 text-sm">
            <button className="pb-2 border-b-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400">
              About
            </button>
            <button className="pb-2 text-gray-500 dark:text-gray-400">
              Settings
            </button>
          </div>

          {/* CONTACT INFORMATION */}
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">
                Phone
              </p>
              <p className="font-medium">+233 234 567 900</p>
            </div>

            <div>
              <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">
                Location
              </p>
              <p className="font-medium">Accra, Ghana</p>
            </div>

            <div>
              <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">
                Member Since
              </p>
              <p className="font-medium">January 2025</p>
            </div>

            <div>
              <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">
                Bio/About
              </p>
              <p className="font-medium">
                Tech enthusiast and frontend developer.
              </p>
            </div>
          </div>

          {/* EDIT FORM */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-4">Edit Information</h3>

            <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm">Full Name</label>
                <input
                  defaultValue="Elizabeth Harrison"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm"
                />
              </div>

              <div>
                <label className="text-sm">Email</label>
                <input
                  defaultValue="elizabethtemi1@gmail.com"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm"
                />
              </div>

              <div>
                <label className="text-sm">Phone Number</label>
                <input
                  defaultValue="+233 553 461 694"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm"
                />
              </div>

              <div>
                <label className="text-sm">Location</label>
                <input
                  defaultValue="Accra, Ghana"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm"
                />
              </div>

              <div className="col-span-full">
                <label className="text-sm">Bio / About</label>
                <textarea
                  rows={4}
                  defaultValue="Tech enthusiast and frontend developer."
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm"
                />
              </div>

              <div className="col-span-full flex justify-end">
                <button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg text-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
