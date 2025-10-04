import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const API_URL = "http://localhost:8000"

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [products, setProducts] = useState([])
  const [message, setMessage] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: "", description: "", price: "" })
  const [editingProduct, setEditingProduct] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    const fetchDashboard = async () => {
      try {
        const response = await axios.get(`${API_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setProducts(response.data.products)
        setUser(response.data.user)
        setMessage(response.data.message)
      } catch (err) {
        console.error("Error fetching dashboard:", err)
        localStorage.removeItem("token")
        navigate("/login")
      }
    }

    fetchDashboard()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  const openForm = () => setShowForm(true)
  const closeForm = () => {
    setShowForm(false)
    setFormData({ name: "", description: "", price: "" })
    setEditingProduct(null)
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    try {
      if (editingProduct) {
        // Update product
        const response = await axios.patch(
          `${API_URL}/product`,
          { id: editingProduct.id, ...formData },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        setProducts(prev => prev.map(p => (p.id === editingProduct.id ? response.data.data : p)))
        setMessage("Product updated successfully!")
      } else {
        // Create product
        const response = await axios.post(
          `${API_URL}/product`,
          {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price)
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        setProducts(prev => [...prev, response.data.data])
        setMessage("Product created!")
      }
      closeForm()
    } catch (error) {
      console.error(editingProduct ? "Error updating product:" : "Error creating product:", error)
      setMessage(editingProduct ? "Error updating product." : "Error creating a product")
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({ name: product.name, description: product.description, price: product.price })
    setShowForm(true)
  }

  const handleDelete = async (productId) => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    try {
      await axios.delete(`${API_URL}/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProducts(prev => prev.filter(product => product.id !== productId))
      setMessage("Product deleted successfully!")
    } catch (error) {
      console.error("Error deleting product:", error)
      setMessage("Error deleting product.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Dashboard</h2>

        {message && (
          <p className="text-center mb-4 text-green-600 font-semibold">{message}</p>
        )}

        {user ? (
          <div className="mb-6 text-center space-y-2">
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.email}</p>

            <button
              onClick={handleLogout}
              className="mt-2 w-full max-w-xs mx-auto bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-600 mb-6">Loading user...</p>
        )}

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Products</h3>
          <button
            onClick={openForm}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Create Product
          </button>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {products.length === 0 && (
            <p className="text-center text-gray-500">No products registered.</p>
          )}

          {products.map((product) => (
            <div key={product.id} className="border rounded p-4 shadow-sm hover:shadow-md transition">
              <h4 className="font-semibold text-lg">{product.name}</h4>
              <p className="text-gray-700">{product.description}</p>
              <p className="font-bold mt-2">$ {Number(product.price).toFixed(2)}</p>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-center">{editingProduct ? "Edit Product" : "Create Product"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Nome do Produto"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="description"
                placeholder="Descrição"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                name="price"
                placeholder="Preço"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  {editingProduct ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
