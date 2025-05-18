const Footer = () => {
  return (
    <footer className="bg-primary-500 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-white">CropSmart</h3>
            <p className="text-primary-100 text-sm mt-1">
              Smart farming decisions for a sustainable future
            </p>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
            <a href="#" className="hover:text-primary-100 text-sm">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary-100 text-sm">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary-100 text-sm">
              Contact Us
            </a>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-primary-400 text-center text-sm text-primary-100">
          &copy; {new Date().getFullYear()} CropSmart. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer; 