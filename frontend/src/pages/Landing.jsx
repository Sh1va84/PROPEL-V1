import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardCheck, Users, ShieldCheck } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white pt-16 pb-32">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            
            {/* Left Side: Text */}
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <div className="text-sm font-semibold tracking-wide text-indigo-600 uppercase sm:text-base lg:text-sm xl:text-base">
                Enterprise Work Order Management
              </div>
              <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                Manage Contractors. <br />
                <span className="text-indigo-600">Streamline Operations.</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                The central hub for assigning jobs, tracking field work, and processing contractor payments. Eliminate paperwork and manage your workforce in real-time.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 shadow-lg hover:shadow-xl transition-all"
                >
                  Assign a Job
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="ml-4 inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Contractor Login
                </Link>
              </div>
            </div>

            {/* Right Side: Visuals */}
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-gradient-to-tr from-gray-100 to-indigo-50 rounded-lg overflow-hidden p-8">
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                      <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                        <ClipboardCheck className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Work Order #402</p>
                        <p className="text-sm text-gray-500">Status: Completed • Paid</p>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 opacity-90">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Active Contractors</p>
                        <p className="text-sm text-gray-500">12 Crews Deployed</p>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 opacity-75">
                      <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <ShieldCheck className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Compliance Check</p>
                        <p className="text-sm text-gray-500">Insurance & Licenses Verified</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 

      {/* Stats Section */}
      <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Built for Operations Managers
            </h2>
            <p className="mt-3 text-xl text-gray-300 sm:mt-4">
              Track performance, manage budgets, and ensure timely delivery across all sites.
            </p>
          </div>
          <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
            <div className="flex flex-col">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-indigo-300">Work Orders</dt>
              <dd className="order-1 text-5xl font-extrabold text-white">5k+</dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-indigo-300">Contractors Onboarded</dt>
              <dd className="order-1 text-5xl font-extrabold text-white">850+</dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-indigo-300">Payments Processed</dt>
              <dd className="order-1 text-5xl font-extrabold text-white">$2M+</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Landing;