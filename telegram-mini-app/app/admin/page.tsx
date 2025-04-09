"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  ShoppingBag,
  Tag,
  LogOut,
  Plus,
  Trash,
  Edit,
  Save,
  X,
  ArrowLeft,
  Eye,
  EyeOff,
  CreditCard,
  Truck,
  Megaphone,
} from "lucide-react"

// Admin authentication state
interface AdminAuth {
  isAuthenticated: boolean
  username: string
  password: string
}

// Product type definition
interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  description: string
  category: string
  isNew?: boolean
  isAvailable: boolean
}

// Promotion type definition
interface Promotion {
  id: number
  title: string
  description: string
  image: string
  discount: string
  endDate?: string
}

// Payment method type
interface PaymentMethod {
  id: number
  name: string
  description: string
  enabled: boolean
}

// Delivery method type
interface DeliveryMethod {
  id: number
  name: string
  description: string
  price: number
  enabled: boolean
}

// Sample products data
const initialProducts: Product[] = [
  {
    id: 1,
    name: "Vintage Denim Jacket",
    price: 89.99,
    originalPrice: 129.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Authentic vintage denim jacket from the 90s. One-of-a-kind piece with unique distressing and fading.",
    category: "Outerwear",
    isNew: true,
    isAvailable: true,
  },
  {
    id: 2,
    name: "Hand-painted T-Shirt",
    price: 59.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Custom hand-painted t-shirt with original artwork. Each piece is unique and signed by the artist.",
    category: "T-Shirts",
    isNew: true,
    isAvailable: true,
  },
  {
    id: 3,
    name: "Reworked Cargo Pants",
    price: 79.99,
    image: "/placeholder.svg?height=300&width=300",
    description:
      "Vintage cargo pants reworked with custom pockets and details. One size fits most with adjustable waist.",
    category: "Pants",
    isAvailable: true,
  },
  {
    id: 4,
    name: "Embroidered Hoodie",
    price: 69.99,
    originalPrice: 89.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Premium cotton hoodie with hand-embroidered details. Each stitch pattern is unique.",
    category: "Outerwear",
    isAvailable: true,
  },
  {
    id: 5,
    name: "Upcycled Denim Bag",
    price: 45.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Handcrafted bag made from upcycled denim. Features unique pocket details and sturdy construction.",
    category: "Accessories",
    isNew: true,
    isAvailable: true,
  },
  {
    id: 6,
    name: "Vintage Band Tee",
    price: 39.99,
    originalPrice: 54.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Authentic vintage band t-shirt from the 80s. Rare find in excellent condition.",
    category: "T-Shirts",
    isAvailable: true,
  },
  {
    id: 7,
    name: "Custom Leather Jacket",
    price: 189.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Handcrafted leather jacket with custom hardware and detailing. One-of-a-kind statement piece.",
    category: "Outerwear",
    isNew: true,
    isAvailable: true,
  },
  {
    id: 8,
    name: "Patchwork Denim Skirt",
    price: 69.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Unique patchwork denim skirt made from vintage jeans. Each panel has its own character and history.",
    category: "Bottoms",
    isAvailable: true,
  },
]

// Sample promotions data
const initialPromotions: Promotion[] = [
  {
    id: 1,
    title: "Unique Collection",
    description: "Exclusive one-of-a-kind pieces",
    image: "/placeholder.svg?height=200&width=400",
    discount: "NEW",
  },
  {
    id: 2,
    title: "Limited Edition",
    description: "Get them before they're gone",
    image: "/placeholder.svg?height=200&width=400",
    discount: "HOT",
  },
  {
    id: 3,
    title: "Flash Sale",
    description: "24 hours only! Special discounts",
    image: "/placeholder.svg?height=200&width=400",
    discount: "24HR",
    endDate: "Today",
  },
  {
    id: 4,
    title: "Vintage Finds",
    description: "Curated selection of unique vintage items",
    image: "/placeholder.svg?height=200&width=400",
    discount: "RARE",
  },
]

// Initial payment methods
const initialPaymentMethods: PaymentMethod[] = [
  {
    id: 1,
    name: "Credit Card",
    description: "Pay with Visa, Mastercard, or American Express",
    enabled: true,
  },
  {
    id: 2,
    name: "Cash on Delivery",
    description: "Pay when you receive your order",
    enabled: true,
  },
  {
    id: 3,
    name: "Bank Transfer",
    description: "Pay directly to our bank account",
    enabled: false,
  },
  {
    id: 4,
    name: "Cryptocurrency",
    description: "Pay with Bitcoin, Ethereum, or other cryptocurrencies",
    enabled: false,
  },
]

// Initial delivery methods
const initialDeliveryMethods: DeliveryMethod[] = [
  {
    id: 1,
    name: "Standard Shipping",
    description: "Delivery in 3-5 business days",
    price: 5.99,
    enabled: true,
  },
  {
    id: 2,
    name: "Express Shipping",
    description: "Delivery in 1-2 business days",
    price: 12.99,
    enabled: true,
  },
  {
    id: 3,
    name: "Local Pickup",
    description: "Pick up your order at our store",
    price: 0,
    enabled: true,
  },
  {
    id: 4,
    name: "International Shipping",
    description: "Delivery in 7-14 business days",
    price: 19.99,
    enabled: false,
  },
]

// Get unique categories from products
const getUniqueCategories = (products: Product[]) => {
  return Array.from(new Set(products.map((product) => product.category)))
}

export default function AdminPanel() {
  const [auth, setAuth] = useState<AdminAuth>({
    isAuthenticated: false,
    username: "",
    password: "",
  })

  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [categories, setCategories] = useState<string[]>(getUniqueCategories(initialProducts))
  const [newCategory, setNewCategory] = useState<string>("")
  const [editingCategory, setEditingCategory] = useState<{ original: string; new: string } | null>(null)

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    price: 0,
    originalPrice: undefined,
    image: "/placeholder.svg?height=300&width=300",
    description: "",
    category: categories[0] || "",
    isNew: false,
    isAvailable: true,
  })

  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions)
  const [newPromotion, setNewPromotion] = useState<Partial<Promotion>>({
    title: "",
    description: "",
    image: "/placeholder.svg?height=200&width=400",
    discount: "",
    endDate: "",
  })
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null)
  const [isAddingPromotion, setIsAddingPromotion] = useState(false)

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods)
  const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[]>(initialDeliveryMethods)
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethod | null>(null)
  const [editingDeliveryMethod, setEditingDeliveryMethod] = useState<DeliveryMethod | null>(null)
  const [isAddingPaymentMethod, setIsAddingPaymentMethod] = useState(false)
  const [isAddingDeliveryMethod, setIsAddingDeliveryMethod] = useState(false)
  const [newPaymentMethod, setNewPaymentMethod] = useState<Partial<PaymentMethod>>({
    name: "",
    description: "",
    enabled: true,
  })
  const [newDeliveryMethod, setNewDeliveryMethod] = useState<Partial<DeliveryMethod>>({
    name: "",
    description: "",
    price: 0,
    enabled: true,
  })

  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple mock authentication - in a real app, this would be a server request
    if (auth.username === "admin" && auth.password === "password") {
      setAuth({ ...auth, isAuthenticated: true })
    } else {
      alert("Invalid credentials. Try username: admin, password: password")
    }
  }

  // Logout handler
  const handleLogout = () => {
    setAuth({
      isAuthenticated: false,
      username: "",
      password: "",
    })
  }

  // Go back to store
  const goToStore = () => {
    router.push("/")
  }

  // Add new category
  const addCategory = () => {
    if (newCategory.trim() === "") return
    if (categories.includes(newCategory.trim())) {
      alert("This category already exists")
      return
    }

    setCategories([...categories, newCategory.trim()])
    setNewCategory("")
    setIsAddingCategory(false)
  }

  // Edit category
  const updateCategory = () => {
    if (!editingCategory) return
    if (editingCategory.new.trim() === "") return
    if (categories.includes(editingCategory.new.trim()) && editingCategory.original !== editingCategory.new.trim()) {
      alert("This category already exists")
      return
    }

    const updatedCategories = categories.map((cat) =>
      cat === editingCategory.original ? editingCategory.new.trim() : cat,
    )

    // Update product categories as well
    const updatedProducts = products.map((product) => ({
      ...product,
      category: product.category === editingCategory.original ? editingCategory.new.trim() : product.category,
    }))

    setCategories(updatedCategories)
    setProducts(updatedProducts)
    setEditingCategory(null)
  }

  // Delete category
  const deleteCategory = (category: string) => {
    if (window.confirm(`Are you sure you want to delete the category "${category}"?`)) {
      const updatedCategories = categories.filter((cat) => cat !== category)

      // Set products in this category to a default category or remove them
      const updatedProducts = products.map((product) => {
        if (product.category === category) {
          return {
            ...product,
            category: updatedCategories[0] || "Uncategorized",
          }
        }
        return product
      })

      setCategories(updatedCategories)
      setProducts(updatedProducts)
    }
  }

  // Add new product
  const addProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.category) {
      alert("Please fill in all required fields")
      return
    }

    const newId = Math.max(...products.map((p) => p.id), 0) + 1

    const productToAdd: Product = {
      id: newId,
      name: newProduct.name || "",
      price: Number(newProduct.price) || 0,
      originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : undefined,
      image: newProduct.image || "/placeholder.svg?height=300&width=300",
      description: newProduct.description || "",
      category: newProduct.category || categories[0] || "",
      isNew: newProduct.isNew || false,
      isAvailable: newProduct.isAvailable !== undefined ? newProduct.isAvailable : true,
    }

    setProducts([...products, productToAdd])
    setNewProduct({
      name: "",
      price: 0,
      originalPrice: undefined,
      image: "/placeholder.svg?height=300&width=300",
      description: "",
      category: categories[0] || "",
      isNew: false,
      isAvailable: true,
    })
    setIsAddingProduct(false)
  }

  // Update product
  const updateProduct = () => {
    if (!editingProduct) return

    if (!editingProduct.name || !editingProduct.price || !editingProduct.description || !editingProduct.category) {
      alert("Please fill in all required fields")
      return
    }

    const updatedProducts = products.map((product) => (product.id === editingProduct.id ? editingProduct : product))

    setProducts(updatedProducts)
    setEditingProduct(null)
  }

  // Delete product
  const deleteProduct = (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const updatedProducts = products.filter((product) => product.id !== id)
      setProducts(updatedProducts)
    }
  }

  // Toggle product availability
  const toggleProductAvailability = (id: number) => {
    const updatedProducts = products.map((product) =>
      product.id === id ? { ...product, isAvailable: !product.isAvailable } : product,
    )
    setProducts(updatedProducts)
  }

  // Add new promotion
  const addPromotion = () => {
    if (!newPromotion.title || !newPromotion.description || !newPromotion.discount) {
      alert("Please fill in all required fields")
      return
    }

    const newId = Math.max(...promotions.map((p) => p.id), 0) + 1

    const promotionToAdd: Promotion = {
      id: newId,
      title: newPromotion.title || "",
      description: newPromotion.description || "",
      image: newPromotion.image || "/placeholder.svg?height=200&width=400",
      discount: newPromotion.discount || "",
      endDate: newPromotion.endDate,
    }

    setPromotions([...promotions, promotionToAdd])
    setNewPromotion({
      title: "",
      description: "",
      image: "/placeholder.svg?height=200&width=400",
      discount: "",
      endDate: "",
    })
    setIsAddingPromotion(false)
  }

  // Update promotion
  const updatePromotion = () => {
    if (!editingPromotion) return

    if (!editingPromotion.title || !editingPromotion.description || !editingPromotion.discount) {
      alert("Please fill in all required fields")
      return
    }

    const updatedPromotions = promotions.map((promotion) =>
      promotion.id === editingPromotion.id ? editingPromotion : promotion,
    )

    setPromotions(updatedPromotions)
    setEditingPromotion(null)
  }

  // Delete promotion
  const deletePromotion = (id: number) => {
    if (window.confirm("Are you sure you want to delete this promotion?")) {
      const updatedPromotions = promotions.filter((promotion) => promotion.id !== id)
      setPromotions(updatedPromotions)
    }
  }

  // Add new payment method
  const addPaymentMethod = () => {
    if (!newPaymentMethod.name || !newPaymentMethod.description) {
      alert("Please fill in all required fields")
      return
    }

    const newId = Math.max(...paymentMethods.map((p) => p.id), 0) + 1

    const paymentMethodToAdd: PaymentMethod = {
      id: newId,
      name: newPaymentMethod.name || "",
      description: newPaymentMethod.description || "",
      enabled: newPaymentMethod.enabled !== undefined ? newPaymentMethod.enabled : true,
    }

    setPaymentMethods([...paymentMethods, paymentMethodToAdd])
    setNewPaymentMethod({
      name: "",
      description: "",
      enabled: true,
    })
    setIsAddingPaymentMethod(false)
  }

  // Update payment method
  const updatePaymentMethod = () => {
    if (!editingPaymentMethod) return

    if (!editingPaymentMethod.name || !editingPaymentMethod.description) {
      alert("Please fill in all required fields")
      return
    }

    const updatedPaymentMethods = paymentMethods.map((method) =>
      method.id === editingPaymentMethod.id ? editingPaymentMethod : method,
    )

    setPaymentMethods(updatedPaymentMethods)
    setEditingPaymentMethod(null)
  }

  // Delete payment method
  const deletePaymentMethod = (id: number) => {
    if (window.confirm("Are you sure you want to delete this payment method?")) {
      const updatedPaymentMethods = paymentMethods.filter((method) => method.id !== id)
      setPaymentMethods(updatedPaymentMethods)
    }
  }

  // Toggle payment method enabled status
  const togglePaymentMethodEnabled = (id: number) => {
    const updatedPaymentMethods = paymentMethods.map((method) =>
      method.id === id ? { ...method, enabled: !method.enabled } : method,
    )
    setPaymentMethods(updatedPaymentMethods)
  }

  // Add new delivery method
  const addDeliveryMethod = () => {
    if (!newDeliveryMethod.name || !newDeliveryMethod.description) {
      alert("Please fill in all required fields")
      return
    }

    const newId = Math.max(...deliveryMethods.map((d) => d.id), 0) + 1

    const deliveryMethodToAdd: DeliveryMethod = {
      id: newId,
      name: newDeliveryMethod.name || "",
      description: newDeliveryMethod.description || "",
      price: Number(newDeliveryMethod.price) || 0,
      enabled: newDeliveryMethod.enabled !== undefined ? newDeliveryMethod.enabled : true,
    }

    setDeliveryMethods([...deliveryMethods, deliveryMethodToAdd])
    setNewDeliveryMethod({
      name: "",
      description: "",
      price: 0,
      enabled: true,
    })
    setIsAddingDeliveryMethod(false)
  }

  // Update delivery method
  const updateDeliveryMethod = () => {
    if (!editingDeliveryMethod) return

    if (!editingDeliveryMethod.name || !editingDeliveryMethod.description) {
      alert("Please fill in all required fields")
      return
    }

    const updatedDeliveryMethods = deliveryMethods.map((method) =>
      method.id === editingDeliveryMethod.id ? editingDeliveryMethod : method,
    )

    setDeliveryMethods(updatedDeliveryMethods)
    setEditingDeliveryMethod(null)
  }

  // Delete delivery method
  const deleteDeliveryMethod = (id: number) => {
    if (window.confirm("Are you sure you want to delete this delivery method?")) {
      const updatedDeliveryMethods = deliveryMethods.filter((method) => method.id !== id)
      setDeliveryMethods(updatedDeliveryMethods)
    }
  }

  // Toggle delivery method enabled status
  const toggleDeliveryMethodEnabled = (id: number) => {
    const updatedDeliveryMethods = deliveryMethods.map((method) =>
      method.id === id ? { ...method, enabled: !method.enabled } : method,
    )
    setDeliveryMethods(updatedDeliveryMethods)
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-center">Admin Login</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access the admin panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={auth.username}
                    onChange={(e) => setAuth({ ...auth, username: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={auth.password}
                      onChange={(e) => setAuth({ ...auth, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900"
                >
                  Login
                </Button>
              </form>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={goToStore}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Store
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <header className="sticky top-0 z-10 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToStore}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Store
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="products" className="flex items-center">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center">
              <Tag className="mr-2 h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="promotions" className="flex items-center">
              <Megaphone className="mr-2 h-4 w-4" />
              Promotions
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              Payment
            </TabsTrigger>
            <TabsTrigger value="delivery" className="flex items-center">
              <Truck className="mr-2 h-4 w-4" />
              Delivery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Products</h2>
              {!isAddingProduct && (
                <Button
                  onClick={() => setIsAddingProduct(true)}
                  className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              )}
            </div>

            {isAddingProduct && (
              <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                  <CardTitle>Add New Product</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <select
                          id="category"
                          className="w-full p-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950"
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                          required
                        >
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price *</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={newProduct.price?.toString() || "0"}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              price: e.target.value ? Number.parseFloat(e.target.value) : 0,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="originalPrice">Original Price (optional)</Label>
                        <Input
                          id="originalPrice"
                          type="number"
                          step="0.01"
                          value={newProduct.originalPrice?.toString() || ""}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              originalPrice: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image">Product Image</Label>
                      <div className="flex flex-col gap-2">
                        <div
                          className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-md p-4 text-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                          onClick={() => document.getElementById("imageUpload")?.click()}
                        >
                          {newProduct.image && newProduct.image.startsWith("data:image") ? (
                            <div className="relative w-full pt-[75%] mb-2">
                              <img
                                src={newProduct.image || "/placeholder.svg"}
                                alt="Product preview"
                                className="absolute inset-0 w-full h-full object-cover rounded-md"
                              />
                            </div>
                          ) : (
                            <div className="py-4">
                              <div className="flex justify-center mb-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-10 w-10 text-zinc-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                              <p className="text-sm text-zinc-500 dark:text-zinc-400">Click to upload an image</p>
                              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                            </div>
                          )}
                          <input
                            type="file"
                            id="imageUpload"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const reader = new FileReader()
                                reader.onloadend = () => {
                                  setNewProduct({ ...newProduct, image: reader.result as string })
                                }
                                reader.readAsDataURL(file)
                              }
                            }}
                          />
                        </div>
                        {newProduct.image && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setNewProduct({ ...newProduct, image: "/placeholder.svg?height=300&width=300" })
                            }
                            className="w-full"
                          >
                            Remove Image
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <textarea
                        id="description"
                        className="w-full p-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 min-h-[100px]"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isNew"
                        checked={newProduct.isNew || false}
                        onChange={(e) => setNewProduct({ ...newProduct, isNew: e.target.checked })}
                        className="rounded border-zinc-300 dark:border-zinc-700"
                      />
                      <Label htmlFor="isNew">Mark as New</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isAvailable"
                        checked={newProduct.isAvailable !== undefined ? newProduct.isAvailable : true}
                        onChange={(e) => setNewProduct({ ...newProduct, isAvailable: e.target.checked })}
                        className="rounded border-zinc-300 dark:border-zinc-700"
                      />
                      <Label htmlFor="isAvailable">Available for Purchase</Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddingProduct(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={addProduct}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900"
                  >
                    Add Product
                  </Button>
                </CardFooter>
              </Card>
            )}

            {editingProduct && (
              <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                  <CardTitle>Edit Product</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Name *</Label>
                        <Input
                          id="edit-name"
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-category">Category *</Label>
                        <select
                          id="edit-category"
                          className="w-full p-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950"
                          value={editingProduct.category}
                          onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                          required
                        >
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-price">Price *</Label>
                        <Input
                          id="edit-price"
                          type="number"
                          step="0.01"
                          value={editingProduct.price?.toString() || "0"}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              price: e.target.value ? Number.parseFloat(e.target.value) : 0,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-originalPrice">Original Price (optional)</Label>
                        <Input
                          id="edit-originalPrice"
                          type="number"
                          step="0.01"
                          value={editingProduct.originalPrice?.toString() || ""}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              originalPrice: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-image">Product Image</Label>
                      <div className="flex flex-col gap-2">
                        <div
                          className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-md p-4 text-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                          onClick={() => document.getElementById("editImageUpload")?.click()}
                        >
                          {editingProduct.image ? (
                            <div className="relative w-full pt-[75%] mb-2">
                              <img
                                src={
                                  editingProduct.image.startsWith("data:image")
                                    ? editingProduct.image
                                    : editingProduct.image
                                }
                                alt="Product preview"
                                className="absolute inset-0 w-full h-full object-cover rounded-md"
                              />
                            </div>
                          ) : (
                            <div className="py-4">
                              <div className="flex justify-center mb-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-10 w-10 text-zinc-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                              <p className="text-sm text-zinc-500 dark:text-zinc-400">Click to upload an image</p>
                              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                            </div>
                          )}
                          <input
                            type="file"
                            id="editImageUpload"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const reader = new FileReader()
                                reader.onloadend = () => {
                                  setEditingProduct({ ...editingProduct, image: reader.result as string })
                                }
                                reader.readAsDataURL(file)
                              }
                            }}
                          />
                        </div>
                        {editingProduct.image && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setEditingProduct({ ...editingProduct, image: "/placeholder.svg?height=300&width=300" })
                            }
                            className="w-full"
                          >
                            Remove Image
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-description">Description *</Label>
                      <textarea
                        id="edit-description"
                        className="w-full p-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 min-h-[100px]"
                        value={editingProduct.description}
                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="edit-isNew"
                        checked={editingProduct.isNew || false}
                        onChange={(e) => setEditingProduct({ ...editingProduct, isNew: e.target.checked })}
                        className="rounded border-zinc-300 dark:border-zinc-700"
                      />
                      <Label htmlFor="edit-isNew">Mark as New</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="edit-isAvailable"
                        checked={editingProduct.isAvailable}
                        onChange={(e) => setEditingProduct({ ...editingProduct, isAvailable: e.target.checked })}
                        className="rounded border-zinc-300 dark:border-zinc-700"
                      />
                      <Label htmlFor="edit-isAvailable">Available for Purchase</Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingProduct(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={updateProduct}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900"
                  >
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className={`border-zinc-200 dark:border-zinc-800 ${!product.isAvailable ? "opacity-70" : ""}`}
                >
                  <div className="flex h-full">
                    <div className="relative w-24 h-24 shrink-0 m-4 rounded-md overflow-hidden">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className={`object-cover w-full h-full ${!product.isAvailable ? "grayscale" : ""}`}
                      />
                    </div>
                    <div className="flex-1 p-4 flex flex-col">
                      <div className="flex justify-between">
                        <h3 className="font-medium truncate">{product.name}</h3>
                        <div className="flex items-center gap-1">
                          {product.isNew && (
                            <span className="px-1.5 py-0.5 text-xs bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded">
                              NEW
                            </span>
                          )}
                          <span
                            className={`px-1.5 py-0.5 text-xs rounded ${
                              product.isAvailable
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                            }`}
                          >
                            {product.isAvailable ? "Available" : "Sold Out"}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">{product.category}</div>
                      <div className="flex items-center gap-1 mb-1">
                        <span className="font-semibold">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-zinc-500 dark:text-zinc-400 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2 mb-2">
                        {product.description}
                      </p>
                      <div className="mt-auto flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => toggleProductAvailability(product.id)}>
                          {product.isAvailable ? "Mark Sold" : "Mark Available"}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setEditingProduct(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Categories</h2>
              {!isAddingCategory && (
                <Button
                  onClick={() => setIsAddingCategory(true)}
                  className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              )}
            </div>

            {isAddingCategory && (
              <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                  <CardTitle>Add New Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="category-name">Category Name</Label>
                      <Input
                        id="category-name"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddingCategory(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={addCategory}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900"
                  >
                    Add Category
                  </Button>
                </CardFooter>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category) => (
                <Card key={category} className="border-zinc-200 dark:border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      {editingCategory && editingCategory.original === category ? (
                        <Input
                          value={editingCategory.new}
                          onChange={(e) => setEditingCategory({ ...editingCategory, new: e.target.value })}
                          className="flex-1 mr-2"
                        />
                      ) : (
                        <h3 className="font-medium">{category}</h3>
                      )}
                      <div className="flex items-center gap-2">
                        {editingCategory && editingCategory.original === category ? (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => setEditingCategory(null)}>
                              <X className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={updateCategory}>
                              <Save className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingCategory({ original: category, new: category })}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => deleteCategory(category)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                      {products.filter((p) => p.category === category).length} products
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="promotions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Promotions</h2>
              {!isAddingPromotion && (
                <Button
                  onClick={() => setIsAddingPromotion(true)}
                  className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Promotion
                </Button>
              )}
            </div>

            {isAddingPromotion && (
              <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                  <CardTitle>Add New Promotion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="promotion-title">Title *</Label>
                        <Input
                          id="promotion-title"
                          value={newPromotion.title}
                          onChange={(e) => setNewPromotion({ ...newPromotion, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="promotion-discount">Discount Label *</Label>
                        <Input
                          id="promotion-discount"
                          value={newPromotion.discount}
                          onChange={(e) => setNewPromotion({ ...newPromotion, discount: e.target.value })}
                          required
                          placeholder="e.g. NEW, SALE, 20% OFF"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="promotion-description">Description *</Label>
                      <Input
                        id="promotion-description"
                        value={newPromotion.description}
                        onChange={(e) => setNewPromotion({ ...newPromotion, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="promotion-endDate">End Date (optional)</Label>
                      <Input
                        id="promotion-endDate"
                        value={newPromotion.endDate || ""}
                        onChange={(e) => setNewPromotion({ ...newPromotion, endDate: e.target.value })}
                        placeholder="e.g. Today, Tomorrow, June 30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="promotion-image">Banner Image</Label>
                      <div className="flex flex-col gap-2">
                        <div
                          className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-md p-4 text-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                          onClick={() => document.getElementById("promotionImageUpload")?.click()}
                        >
                          {newPromotion.image && newPromotion.image.startsWith("data:image") ? (
                            <div className="relative w-full pt-[50%] mb-2">
                              <img
                                src={newPromotion.image || "/placeholder.svg"}
                                alt="Promotion preview"
                                className="absolute inset-0 w-full h-full object-cover rounded-md"
                              />
                            </div>
                          ) : (
                            <div className="py-4">
                              <div className="flex justify-center mb-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-10 w-10 text-zinc-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                              <p className="text-sm text-zinc-500 dark:text-zinc-400">Click to upload an image</p>
                              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                            </div>
                          )}
                          <input
                            type="file"
                            id="promotionImageUpload"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const reader = new FileReader()
                                reader.onloadend = () => {
                                  setNewPromotion({ ...newPromotion, image: reader.result as string })
                                }
                                reader.readAsDataURL(file)
                              }
                            }}
                          />
                        </div>
                        {newPromotion.image && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setNewPromotion({ ...newPromotion, image: "/placeholder.svg?height=200&width=400" })
                            }
                            className="w-full"
                          >
                            Remove Image
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddingPromotion(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={addPromotion}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900"
                  >
                    Add Promotion
                  </Button>
                </CardFooter>
              </Card>
            )}

            {editingPromotion && (
              <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                  <CardTitle>Edit Promotion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-promotion-title">Title *</Label>
                        <Input
                          id="edit-promotion-title"
                          value={editingPromotion.title}
                          onChange={(e) => setEditingPromotion({ ...editingPromotion, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-promotion-discount">Discount Label *</Label>
                        <Input
                          id="edit-promotion-discount"
                          value={editingPromotion.discount}
                          onChange={(e) => setEditingPromotion({ ...editingPromotion, discount: e.target.value })}
                          required
                          placeholder="e.g. NEW, SALE, 20% OFF"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-promotion-description">Description *</Label>
                      <Input
                        id="edit-promotion-description"
                        value={editingPromotion.description}
                        onChange={(e) => setEditingPromotion({ ...editingPromotion, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-promotion-endDate">End Date (optional)</Label>
                      <Input
                        id="edit-promotion-endDate"
                        value={editingPromotion.endDate || ""}
                        onChange={(e) => setEditingPromotion({ ...editingPromotion, endDate: e.target.value })}
                        placeholder="e.g. Today, Tomorrow, June 30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-promotion-image">Banner Image</Label>
                      <div className="flex flex-col gap-2">
                        <div
                          className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-md p-4 text-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                          onClick={() => document.getElementById("editPromotionImageUpload")?.click()}
                        >
                          {editingPromotion.image && editingPromotion.image.startsWith("data:image") ? (
                            <div className="relative w-full pt-[50%] mb-2">
                              <img
                                src={editingPromotion.image || "/placeholder.svg"}
                                alt="Promotion preview"
                                className="absolute inset-0 w-full h-full object-cover rounded-md"
                              />
                            </div>
                          ) : (
                            <div className="py-4">
                              <div className="flex justify-center mb-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-10 w-10 text-zinc-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                              <p className="text-sm text-zinc-500 dark:text-zinc-400">Click to upload an image</p>
                              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                            </div>
                          )}
                          <input
                            type="file"
                            id="editPromotionImageUpload"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const reader = new FileReader()
                                reader.onloadend = () => {
                                  setEditingPromotion({ ...editingPromotion, image: reader.result as string })
                                }
                                reader.readAsDataURL(file)
                              }
                            }}
                          />
                        </div>
                        {editingPromotion.image && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setEditingPromotion({
                                ...editingPromotion,
                                image: "/placeholder.svg?height=200&width=400",
                              })
                            }
                            className="w-full"
                          >
                            Remove Image
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingPromotion(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={updatePromotion}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900"
                  >
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {promotions.map((promotion) => (
                <Card key={promotion.id} className="border-zinc-200 dark:border-zinc-800">
                  <div className="flex h-full">
                    <div className="relative w-32 h-24 shrink-0 m-4 rounded-md overflow-hidden bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-900">
                      {promotion.image && (
                        <img
                          src={promotion.image || "/placeholder.svg"}
                          alt={promotion.title}
                          className="object-cover w-full h-full opacity-60"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="px-2 py-1 bg-white/20 text-white text-xs font-bold rounded backdrop-blur-sm">
                          {promotion.discount}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 p-4 flex flex-col">
                      <div className="flex justify-between">
                        <h3 className="font-medium truncate">{promotion.title}</h3>
                      </div>
                      <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">{promotion.description}</div>
                      {promotion.endDate && (
                        <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">Ends: {promotion.endDate}</div>
                      )}
                      <div className="mt-auto flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingPromotion(promotion)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                          onClick={() => deletePromotion(promotion.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Payment Methods</h2>
              {!isAddingPaymentMethod && (
                <Button
                  onClick={() => setIsAddingPaymentMethod(true)}
                  className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Payment Method
                </Button>
              )}
            </div>

            {isAddingPaymentMethod && (
              <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                  <CardTitle>Add New Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="payment-name">Name *</Label>
                      <Input
                        id="payment-name"
                        value={newPaymentMethod.name}
                        onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payment-description">Description *</Label>
                      <Input
                        id="payment-description"
                        value={newPaymentMethod.description}
                        onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="payment-enabled"
                        checked={newPaymentMethod.enabled !== undefined ? newPaymentMethod.enabled : true}
                        onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, enabled: e.target.checked })}
                        className="rounded border-zinc-300 dark:border-zinc-700"
                      />
                      <Label htmlFor="payment-enabled">Enabled</Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddingPaymentMethod(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={addPaymentMethod}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900"
                  >
                    Add Payment Method
                  </Button>
                </CardFooter>
              </Card>
            )}

            {editingPaymentMethod && (
              <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                  <CardTitle>Edit Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-payment-name">Name *</Label>
                      <Input
                        id="edit-payment-name"
                        value={editingPaymentMethod.name}
                        onChange={(e) => setEditingPaymentMethod({ ...editingPaymentMethod, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-payment-description">Description *</Label>
                      <Input
                        id="edit-payment-description"
                        value={editingPaymentMethod.description}
                        onChange={(e) =>
                          setEditingPaymentMethod({ ...editingPaymentMethod, description: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="edit-payment-enabled"
                        checked={editingPaymentMethod.enabled}
                        onChange={(e) =>
                          setEditingPaymentMethod({ ...editingPaymentMethod, enabled: e.target.checked })
                        }
                        className="rounded border-zinc-300 dark:border-zinc-700"
                      />
                      <Label htmlFor="edit-payment-enabled">Enabled</Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingPaymentMethod(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={updatePaymentMethod}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900"
                  >
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <Card
                  key={method.id}
                  className={`border-zinc-200 dark:border-zinc-800 ${!method.enabled ? "opacity-70" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                        <h3 className="font-medium">{method.name}</h3>
                      </div>
                      <span
                        className={`px-1.5 py-0.5 text-xs rounded ${
                          method.enabled
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        }`}
                      >
                        {method.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{method.description}</p>
                    <div className="mt-4 flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => togglePaymentMethodEnabled(method.id)}>
                        {method.enabled ? "Disable" : "Enable"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingPaymentMethod(method)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        onClick={() => deletePaymentMethod(method.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="delivery" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Delivery Methods</h2>
              {!isAddingDeliveryMethod && (
                <Button
                  onClick={() => setIsAddingDeliveryMethod(true)}
                  className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Delivery Method
                </Button>
              )}
            </div>

            {isAddingDeliveryMethod && (
              <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                  <CardTitle>Add New Delivery Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="delivery-name">Name *</Label>
                      <Input
                        id="delivery-name"
                        value={newDeliveryMethod.name}
                        onChange={(e) => setNewDeliveryMethod({ ...newDeliveryMethod, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="delivery-description">Description *</Label>
                      <Input
                        id="delivery-description"
                        value={newDeliveryMethod.description}
                        onChange={(e) => setNewDeliveryMethod({ ...newDeliveryMethod, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="delivery-price">Price *</Label>
                      <Input
                        id="delivery-price"
                        type="number"
                        step="0.01"
                        value={newDeliveryMethod.price?.toString() || "0"}
                        onChange={(e) =>
                          setNewDeliveryMethod({
                            ...newDeliveryMethod,
                            price: e.target.value ? Number.parseFloat(e.target.value) : 0,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="delivery-enabled"
                        checked={newDeliveryMethod.enabled !== undefined ? newDeliveryMethod.enabled : true}
                        onChange={(e) => setNewDeliveryMethod({ ...newDeliveryMethod, enabled: e.target.checked })}
                        className="rounded border-zinc-300 dark:border-zinc-700"
                      />
                      <Label htmlFor="delivery-enabled">Enabled</Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddingDeliveryMethod(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={addDeliveryMethod}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900"
                  >
                    Add Delivery Method
                  </Button>
                </CardFooter>
              </Card>
            )}

            {editingDeliveryMethod && (
              <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                  <CardTitle>Edit Delivery Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-delivery-name">Name *</Label>
                      <Input
                        id="edit-delivery-name"
                        value={editingDeliveryMethod.name}
                        onChange={(e) => setEditingDeliveryMethod({ ...editingDeliveryMethod, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-delivery-description">Description *</Label>
                      <Input
                        id="edit-delivery-description"
                        value={editingDeliveryMethod.description}
                        onChange={(e) =>
                          setEditingDeliveryMethod({ ...editingDeliveryMethod, description: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-delivery-price">Price *</Label>
                      <Input
                        id="edit-delivery-price"
                        type="number"
                        step="0.01"
                        value={editingDeliveryMethod.price?.toString() || "0"}
                        onChange={(e) =>
                          setEditingDeliveryMethod({
                            ...editingDeliveryMethod,
                            price: e.target.value ? Number.parseFloat(e.target.value) : 0,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="edit-delivery-enabled"
                        checked={editingDeliveryMethod.enabled}
                        onChange={(e) =>
                          setEditingDeliveryMethod({ ...editingDeliveryMethod, enabled: e.target.checked })
                        }
                        className="rounded border-zinc-300 dark:border-zinc-700"
                      />
                      <Label htmlFor="edit-delivery-enabled">Enabled</Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingDeliveryMethod(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={updateDeliveryMethod}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900"
                  >
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deliveryMethods.map((method) => (
                <Card
                  key={method.id}
                  className={`border-zinc-200 dark:border-zinc-800 ${!method.enabled ? "opacity-70" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                        <h3 className="font-medium">{method.name}</h3>
                      </div>
                      <span
                        className={`px-1.5 py-0.5 text-xs rounded ${
                          method.enabled
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        }`}
                      >
                        {method.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{method.description}</p>
                    <div className="mt-2 font-semibold">
                      {method.price === 0 ? "Free" : `$${method.price.toFixed(2)}`}
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => toggleDeliveryMethodEnabled(method.id)}>
                        {method.enabled ? "Disable" : "Enable"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingDeliveryMethod(method)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        onClick={() => deleteDeliveryMethod(method.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
