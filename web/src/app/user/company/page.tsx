import Image from "next/image";

export default function UserCompanyPage() {
  return (
    <div className="p-6 sm:p-10 min-h-screen bg-gray-100 dark:bg-[#0b0c10] text-gray-900 dark:text-gray-100">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-bold">Company Profile</h1>

        <div className="flex gap-3 mt-4 sm:mt-0">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
            Edit Profile
          </button>
        </div>
      </div>

      {/* VIEW SECTION */}
      <div className="bg-white dark:bg-[#1a1d24] p-6 rounded-2xl shadow mb-12">
        <div className="relative w-full h-56 rounded-xl overflow-hidden mb-6">
          <Image
            src="https://i.pinimg.com/1200x/53/bb/a5/53bba57fcb64c79582f30c913c2eb7f4.jpg"
            alt="Company Logo"
            fill
            className="object-cover"
          />
        </div>

        <button className="text-sm px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700">
          Change Image
        </button>

        {/* COMPANY INFO GRID */}
        <h2 className="text-xl font-semibold mt-8 mb-4">Company Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Company Name</p>
            <p className="font-medium">Neo Creative Solutions Ltd.</p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400">Main Contact</p>
            <p className="font-medium">neo@creative.co</p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400">Alt Contact</p>
            <p className="font-medium">info@neocreative.co</p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400">Project Manager</p>
            <p className="font-medium">Stephanie Ike Okafor</p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400">Key Org Units</p>
            <p className="font-medium">10</p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400">Sector</p>
            <p className="font-medium">Technology</p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400">Product/Service</p>
            <p className="font-medium">SaaS Platform</p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400">Annual Revenue</p>
            <p className="font-medium">$24,000</p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400">
              Operational Years
            </p>
            <p className="font-medium">3 Years</p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400">Total Users</p>
            <p className="font-medium">400</p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400">Total Employees</p>
            <p className="font-medium">12</p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400">Expectation</p>
            <p className="font-medium">To increase retention by 20%</p>
          </div>
        </div>

        {/* MISSION */}
        <div className="mt-8">
          <p className="text-gray-500 dark:text-gray-400 mb-2">Mission</p>
          <p className="text-sm leading-relaxed">
            Our mission is to support SMEs with affordable digital solutions to
            expand their business growth and operational efficiency.
          </p>
        </div>
      </div>

      {/* EDIT SECTION */}
      <div className="bg-white dark:bg-[#1a1d24] p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-6">Edit Company Information</h2>

        <form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1 */}
          <div className="space-y-4">
            <label className="block text-sm">
              Company Name
              <input
                type="text"
                className="mt-1 w-full px-3 py-2 rounded-lg border dark:bg-[#0f1113]"
                defaultValue="Creative Solutions Ltd."
              />
            </label>

            <label className="block text-sm">
              Main Contact
              <input
                type="text"
                className="mt-1 w-full px-3 py-2 rounded-lg border dark:bg-[#0f1113]"
                defaultValue="temi@creative.co"
              />
            </label>

            <label className="block text-sm">
              Alt Contact
              <input
                type="text"
                className="mt-1 w-full px-3 py-2 rounded-lg border dark:bg-[#0f1113]"
                defaultValue="info@creative.co"
              />
            </label>

            <label className="block text-sm">
              Project Manager
              <input
                type="text"
                className="mt-1 w-full px-3 py-2 rounded-lg border dark:bg-[#0f1113]"
                defaultValue="Kwame Mensah"
              />
            </label>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <label className="block text-sm">
              Key Org Units
              <input
                type="number"
                className="mt-1 w-full px-3 py-2 rounded-lg border dark:bg-[#0f1113]"
                defaultValue="6"
              />
            </label>

            <label className="block text-sm">
              Sector
              <input
                type="text"
                className="mt-1 w-full px-3 py-2 rounded-lg border dark:bg-[#0f1113]"
                defaultValue="Technology"
              />
            </label>

            <label className="block text-sm">
              Product or Service
              <input
                type="text"
                className="mt-1 w-full px-3 py-2 rounded-lg border dark:bg-[#0f1113]"
                defaultValue="SaaS Platform"
              />
            </label>

            <label className="block text-sm">
              Annual Revenue
              <input
                type="number"
                className="mt-1 w-full px-3 py-2 rounded-lg border dark:bg-[#0f1113]"
                defaultValue="240000"
              />
            </label>
          </div>

          {/* Column 3 */}
          <div className="space-y-4">
            <label className="block text-sm">
              Operational Years
              <input
                type="number"
                className="mt-1 w-full px-3 py-2 rounded-lg border dark:bg-[#0f1113]"
                defaultValue="5"
              />
            </label>

            <label className="block text-sm">
              Total Users
              <input
                type="number"
                className="mt-1 w-full px-3 py-2 rounded-lg border dark:bg-[#0f1113]"
                defaultValue="8400"
              />
            </label>

            <label className="block text-sm">
              Total Employees
              <input
                type="number"
                className="mt-1 w-full px-3 py-2 rounded-lg border dark:bg-[#0f1113]"
                defaultValue="120"
              />
            </label>

            <label className="block text-sm">
              Expectation
              <input
                type="text"
                className="mt-1 w-full px-3 py-2 rounded-lg border dark:bg-[#0f1113]"
                defaultValue="Increase retention by 20%"
              />
            </label>
          </div>

          {/* Mission */}
          <div className="lg:col-span-3 mt-4">
            <label className="block text-sm">
              Mission
              <textarea
                rows={4}
                className="mt-1 w-full px-3 py-2 rounded-lg border dark:bg-[#0f1113]"
                defaultValue="Our mission is to support SMEs with digital tools."
              />
            </label>
          </div>

          {/* Buttons */}
          <div className="lg:col-span-3 flex justify-end gap-3 mt-6">
            <button className="px-4 py-2 rounded-lg border dark:border-gray-600">
              Cancel
            </button>
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
