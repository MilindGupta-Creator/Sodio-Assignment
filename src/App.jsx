import BookTable from './components/BookTable'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Library Management System</h1>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Book Inventory</h2>

          </div>
          <p className="mt-2 text-sm text-gray-600">Manage and track your library's book inventory</p>
        </div>

        <div className="bg-white shadow-sm rounded-lg">
          <BookTable />
        </div>
      </main>
    </div>
  )
}

export default App
