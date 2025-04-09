"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingCart,
  Heart,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Plus,
  Minus,
  Sparkles,
} from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"

// Define the Telegram WebApp type
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void
        expand: () => void
        close: () => void
        MainButton: {
          text: string
          color: string
          textColor: string
          isVisible: boolean
          show: () => void
          hide: () => void
          onClick: (callback: () => void) => void
        }
        BackButton: {
          isVisible: boolean
          show: () => void
          hide: () => void
          onClick: (callback: () => void) => void
        }
        initData: string
        initDataUnsafe: {
          user?: {
            id: number
            first_name: string
            last_name?: string
            username?: string
          }
        }
      }
    }
  }
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

// Cart item type definition
interface CartItem {
  product: Product
  quantity: number
}

// Sample promotions data
const promotions: Promotion[] = [
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

// Sample products data
const initialProducts: Product[] = [
  {
    id: 1,
    name: "Vintage Denim Jacket",
    price: 89.99,
    originalPrice: 129.99,
    image: "/placeholder.svg?height=400&width=300",
    description: "Authentic vintage denim jacket from the 90s. One-of-a-kind piece with unique distressing and fading.",
    category: "Outerwear",
    isNew: true,
    isAvailable: true,
  },
  {
    id: 2,
    name: "Hand-painted T-Shirt",
    price: 59.99,
    image: "/placeholder.svg?height=400&width=300",
    description: "Custom hand-painted t-shirt with original artwork. Each piece is unique and signed by the artist.",
    category: "T-Shirts",
    isNew: true,
    isAvailable: true,
  },
  {
    id: 3,
    name: "Reworked Cargo Pants",
    price: 79.99,
    image: "/placeholder.svg?height=400&width=300",
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
    image: "/placeholder.svg?height=400&width=300",
    description: "Premium cotton hoodie with hand-embroidered details. Each stitch pattern is unique.",
    category: "Outerwear",
    isAvailable: true,
  },
  {
    id: 5,
    name: "Upcycled Denim Bag",
    price: 45.99,
    image: "/placeholder.svg?height=400&width=300",
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
    image: "/placeholder.svg?height=400&width=300",
    description: "Authentic vintage band t-shirt from the 80s. Rare find in excellent condition.",
    category: "T-Shirts",
    isAvailable: true,
  },
  {
    id: 7,
    name: "Custom Leather Jacket",
    price: 189.99,
    image: "/placeholder.svg?height=400&width=300",
    description: "Handcrafted leather jacket with custom hardware and detailing. One-of-a-kind statement piece.",
    category: "Outerwear",
    isNew: true,
    isAvailable: true,
  },
  {
    id: 8,
    name: "Patchwork Denim Skirt",
    price: 69.99,
    image: "/placeholder.svg?height=400&width=300",
    description: "Unique patchwork denim skirt made from vintage jeans. Each panel has its own character and history.",
    category: "Bottoms",
    isAvailable: true,
  },
]

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

const slideIn = {
  hidden: { x: 20, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
    },
  }),
}

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  }),
}

const scaleUp = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
  exit: {
    scale: 0.9,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
}

const bannerVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.3 },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.3 },
    },
  }),
}

export default function ClothesShop() {
  const [view, setView] = useState<"products" | "details" | "cart" | "promotion">("products")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isTelegramAvailable, setIsTelegramAvailable] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [currentPromotionIndex, setCurrentPromotionIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [products, setProducts] = useState(initialProducts)

  // For admin panel access
  const [titleTapCount, setTitleTapCount] = useState(0)
  const titleTapTimer = useRef<NodeJS.Timeout | null>(null)

  const router = useRouter()

  // Get unique categories from products
  const categories = ["All", ...Array.from(new Set(products.map((product) => product.category)))]

  // After mounting, we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-rotate banner
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setDirection(1)
        setCurrentPromotionIndex((prevIndex) => (prevIndex + 1) % promotions.length)
      }
    }, 5000) // Change banner every 5 seconds

    return () => clearInterval(interval)
  }, [isAnimating])

  useEffect(() => {
    // Check if Telegram WebApp is available
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp

      // Tell Telegram that the Mini App is ready
      tg.ready()

      // Expand the Mini App to full height
      tg.expand()

      setIsTelegramAvailable(true)
    }
  }, [])

  useEffect(() => {
    if (!isTelegramAvailable) return

    const tg = window.Telegram.WebApp

    // Configure back button
    if (view === "products") {
      tg.BackButton.hide()
    } else {
      tg.BackButton.show()
      tg.BackButton.onClick(() => {
        if (view === "details") {
          setView("products")
          setSelectedProduct(null)
        } else if (view === "cart") {
          setView("products")
        } else if (view === "promotion") {
          setView("products")
          setSelectedPromotion(null)
        }
      })
    }

    // Configure main button
    if (view === "cart" && cart.length > 0) {
      tg.MainButton.text = "Checkout"
      tg.MainButton.show()
      tg.MainButton.onClick(() => {
        // In a real app, you would send the cart data to your backend
        alert("Order placed successfully!")
        setCart([])
        setView("products")
        tg.MainButton.hide()
      })
    } else if (view === "details" && selectedProduct && selectedProduct.isAvailable) {
      tg.MainButton.text = "Add to Cart"
      tg.MainButton.show()
      tg.MainButton.onClick(() => {
        if (selectedProduct) {
          addToCart(selectedProduct)
          tg.MainButton.hide()
          setView("products")
          setSelectedProduct(null)
        }
      })
    } else {
      tg.MainButton.hide()
    }

    return () => {
      tg.BackButton.offClick()
      tg.MainButton.offClick()
    }
  }, [view, selectedProduct, cart, isTelegramAvailable, selectedPromotion])

  const showProductDetails = (product: Product) => {
    setSelectedProduct(product)
    setIsFavorite(false)
    setView("details")
  }

  const showPromotionDetails = (promotion: Promotion) => {
    setSelectedPromotion(promotion)
    setView("promotion")
  }

  const addToCart = (product: Product) => {
    const existingItemIndex = cart.findIndex((item) => item.product.id === product.id)

    if (existingItemIndex !== -1) {
      const updatedCart = [...cart]
      updatedCart[existingItemIndex].quantity += 1
      setCart(updatedCart)
    } else {
      setCart([...cart, { product, quantity: 1 }])
    }
  }

  const updateCartItemQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return

    const updatedCart = [...cart]
    updatedCart[index].quantity = newQuantity
    setCart(updatedCart)
  }

  const removeFromCart = (index: number) => {
    const newCart = [...cart]
    newCart.splice(index, 1)
    setCart(newCart)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2)
  }

  const handlePrevPromotion = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setDirection(-1)
    setCurrentPromotionIndex((prevIndex) => (prevIndex - 1 + promotions.length) % promotions.length)
  }

  const handleNextPromotion = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setDirection(1)
    setCurrentPromotionIndex((prevIndex) => (prevIndex + 1) % promotions.length)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const goToAdmin = () => {
    router.push("/admin")
  }

  const handleTitleTap = () => {
    setTitleTapCount((prev) => prev + 1)

    if (titleTapTimer.current) {
      clearTimeout(titleTapTimer.current)
    }

    titleTapTimer.current = setTimeout(() => {
      if (titleTapCount >= 2) {
        router.push("/admin")
      }
      setTitleTapCount(0)
    }, 500)
  }

  const renderPromotionBanner = () => {
    const currentPromotion = promotions[currentPromotionIndex]

    return (
      <div className="mb-6 mt-2">
        <div
          className="relative h-[160px] mx-4 rounded-xl overflow-hidden cursor-pointer bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-900 shadow-lg"
          onClick={() => showPromotionDetails(currentPromotion)}
        >
          <AnimatePresence initial={false} custom={direction} onExitComplete={() => setIsAnimating(false)}>
            <motion.div
              key={currentPromotionIndex}
              custom={direction}
              variants={bannerVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 p-6 flex flex-col justify-center z-10"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="inline-block px-2 py-1 rounded-md text-xs font-bold mb-1 bg-white/20 text-white backdrop-blur-sm"
              >
                {currentPromotion.discount}
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="text-xl font-bold text-white"
              >
                {currentPromotion.title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="text-sm text-white/80"
              >
                {currentPromotion.description}
              </motion.p>
              {currentPromotion.endDate && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="text-xs mt-2 text-white/70"
                >
                  Ends: {currentPromotion.endDate}
                </motion.p>
              )}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="flex items-center mt-2 text-white"
              >
                <span className="text-xs font-medium">Shop Now</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
                >
                  <ArrowRight className="h-3 w-3 ml-1" />
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 rounded-full p-1 z-20 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation()
              handlePrevPromotion()
            }}
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 rounded-full p-1 z-20 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation()
              handleNextPromotion()
            }}
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </motion.button>

          {/* Indicator dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
            {promotions.map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8 }}
                animate={{
                  scale: index === currentPromotionIndex ? 1.2 : 0.8,
                  backgroundColor: index === currentPromotionIndex ? "rgb(255, 255, 255)" : "rgba(255, 255, 255, 0.4)",
                }}
                transition={{ duration: 0.3 }}
                className="h-1.5 w-1.5 rounded-full"
              />
            ))}
          </div>

          {/* Decorative elements */}
          <motion.div
            className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/5"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-white/5"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </div>
      </div>
    )
  }

  const renderProductsList = () => {
    const filteredProducts =
      selectedCategory === "All" ? products : products.filter((product) => product.category === selectedCategory)

    return (
      <motion.div variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-4 pb-4">
        {renderPromotionBanner()}

        <div className="px-4 mb-4">
          <div className="overflow-x-auto pb-2 -mx-1">
            <div className="flex gap-2 px-1">
              {categories.map((category) => (
                <motion.div key={category} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`whitespace-nowrap rounded-full ${
                      selectedCategory === category
                        ? "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900"
                        : "border-zinc-200 dark:border-zinc-700"
                    }`}
                  >
                    {category}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 px-4">
          {filteredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              custom={i}
              variants={slideUp}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <Card className="overflow-hidden h-full flex flex-col border-zinc-200 dark:border-zinc-800 shadow-md relative before:absolute before:inset-0 before:z-0 before:border-2 before:border-zinc-100 before:dark:border-zinc-800 before:rounded-lg before:translate-x-1 before:translate-y-1">
                <div className="relative h-[225px]">
                  <Image
                    src={product.image || "/placeholder.svg?height=400&width=300"}
                    alt={product.name}
                    fill
                    className={`object-cover ${!product.isAvailable ? "opacity-50 grayscale" : ""}`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {!product.isAvailable && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="px-2 py-1 rounded-md text-xs font-bold bg-zinc-900 text-white dark:bg-zinc-700"
                      >
                        SOLD OUT
                      </motion.div>
                    )}
                    {product.isNew && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="px-2 py-1 rounded-md text-xs font-bold bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center gap-1"
                      >
                        <Sparkles className="h-3 w-3" />
                        NEW
                      </motion.div>
                    )}
                  </div>

                  {/* Add decorative corner accent */}
                  <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-zinc-900/20 to-transparent transform rotate-45 translate-x-12 -translate-y-12"></div>
                  </div>
                </div>
                <CardHeader className="p-3 flex-1 relative z-10">
                  <CardTitle className="text-sm truncate">{product.name}</CardTitle>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      {product.originalPrice ? (
                        <>
                          <Badge
                            variant="outline"
                            className="w-fit bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white"
                          >
                            ${product.price}
                          </Badge>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400 line-through">
                            ${product.originalPrice}
                          </span>
                        </>
                      ) : (
                        <Badge variant="outline" className="w-fit border-zinc-200 dark:border-zinc-700">
                          ${product.price}
                        </Badge>
                      )}
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                    >
                      {product.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardFooter className="p-3 pt-0 relative z-10">
                  <motion.div whileTap={{ scale: 0.95 }} className="w-full">
                    <Button
                      variant="default"
                      size="sm"
                      className={`w-full ${
                        product.isAvailable
                          ? "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900"
                          : "bg-zinc-300 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 cursor-not-allowed"
                      }`}
                      onClick={() => product.isAvailable && showProductDetails(product)}
                      disabled={!product.isAvailable}
                    >
                      {product.isAvailable ? "View Details" : "Sold Out"}
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }

  const renderProductDetails = () => {
    if (!selectedProduct) return null

    return (
      <motion.div variants={scaleUp} initial="hidden" animate="visible" exit="exit" className="p-4">
        <div className="relative h-[300px] mb-4 rounded-xl overflow-hidden">
          <Image
            src={selectedProduct.image || "/placeholder.svg?height=400&width=300"}
            alt={selectedProduct.name}
            fill
            className={`object-cover ${!selectedProduct.isAvailable ? "opacity-70 grayscale" : ""}`}
            sizes="100vw"
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {!selectedProduct.isAvailable && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="px-2 py-1 rounded-md text-xs font-bold bg-zinc-900 text-white"
              >
                SOLD OUT
              </motion.div>
            )}
            {selectedProduct.isNew && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="px-2 py-1 rounded-md text-xs font-bold bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center gap-1"
              >
                <Sparkles className="h-3 w-3" />
                NEW
              </motion.div>
            )}
          </div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-2 right-2"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/80 dark:bg-zinc-900/80 rounded-full backdrop-blur-sm"
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </motion.div>

          {/* Add decorative corner accents */}
          <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-zinc-900/20 to-transparent transform rotate-45 translate-x-16 -translate-y-16"></div>
          </div>
          <div className="absolute bottom-0 left-0 w-24 h-24 overflow-hidden">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-zinc-900/20 to-transparent transform rotate-45 -translate-x-16 translate-y-16"></div>
          </div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl font-bold mb-1"
        >
          {selectedProduct.name}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 mb-3"
        >
          {selectedProduct.originalPrice ? (
            <>
              <span className="text-lg font-semibold">${selectedProduct.price}</span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400 line-through">
                ${selectedProduct.originalPrice}
              </span>
              <Badge
                variant="outline"
                className="ml-1 bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white"
              >
                {Math.round(
                  ((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100,
                )}
                % OFF
              </Badge>
            </>
          ) : (
            <span className="text-lg font-semibold">${selectedProduct.price}</span>
          )}
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-zinc-600 dark:text-zinc-300 mb-6 p-3 border-l-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 rounded-r-md"
        >
          {selectedProduct.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-4 p-4 bg-zinc-100 dark:bg-zinc-800/50 rounded-md"
        >
          <h3 className="font-medium mb-2 flex items-center">
            <Sparkles className="h-4 w-4 mr-2" />
            One-of-a-kind item:
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            This is a unique piece that is only available in one size and color. Once it's gone, it's gone forever!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <h3 className="font-medium mb-2">Category:</h3>
          <Badge className="bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
            {selectedProduct.category}
          </Badge>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileTap={{ scale: 0.98 }}
          className="w-full"
        >
          <Button
            className={`w-full ${
              selectedProduct.isAvailable
                ? "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900"
                : "bg-zinc-300 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 cursor-not-allowed"
            }`}
            size="lg"
            disabled={!selectedProduct.isAvailable}
            onClick={() => {
              if (selectedProduct.isAvailable) {
                addToCart(selectedProduct)
                setView("cart")
              }
            }}
          >
            {selectedProduct.isAvailable ? "Add to Cart" : "Sold Out"}
          </Button>
        </motion.div>
      </motion.div>
    )
  }

  const renderPromotionDetails = () => {
    if (!selectedPromotion) return null

    // Show available products
    const availableProducts = products.filter((product) => product.isAvailable).slice(0, 4)

    return (
      <motion.div variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="p-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative h-40 mb-6 rounded-xl overflow-hidden bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-900"
        >
          <div className="absolute inset-0 p-4 flex flex-col justify-center z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="inline-block px-2 py-1 rounded-md text-xs font-bold mb-1 bg-white/20 text-white backdrop-blur-sm"
            >
              {selectedPromotion.discount}
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="text-2xl font-bold text-white"
            >
              {selectedPromotion.title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="text-sm text-white/80"
            >
              {selectedPromotion.description}
            </motion.p>
            {selectedPromotion.endDate && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="text-xs mt-2 text-white/70"
              >
                Ends: {selectedPromotion.endDate}
              </motion.p>
            )}
          </div>

          {/* Decorative elements */}
          <motion.div
            className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/5"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-white/5"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="text-xl font-bold mb-4 flex items-center"
        >
          <Sparkles className="h-5 w-5 mr-2" />
          Featured Items
        </motion.h2>

        <div className="grid grid-cols-2 gap-4">
          {availableProducts.map((product, i) => (
            <motion.div
              key={product.id}
              custom={i}
              variants={slideUp}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <Card className="overflow-hidden h-full flex flex-col border-zinc-200 dark:border-zinc-800 shadow-md relative before:absolute before:inset-0 before:z-0 before:border-2 before:border-zinc-100 before:dark:border-zinc-800 before:rounded-lg before:translate-x-1 before:translate-y-1">
                <div className="relative h-[225px]">
                  <Image
                    src={product.image || "/placeholder.svg?height=400&width=300"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {product.isNew && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-bold bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center gap-1"
                    >
                      <Sparkles className="h-3 w-3" />
                      NEW
                    </motion.div>
                  )}

                  {/* Add decorative corner accent */}
                  <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-zinc-900/20 to-transparent transform rotate-45 translate-x-12 -translate-y-12"></div>
                  </div>
                </div>
                <CardHeader className="p-3 flex-1 relative z-10">
                  <CardTitle className="text-sm truncate">{product.name}</CardTitle>
                  <div className="flex items-center gap-1">
                    {product.originalPrice ? (
                      <>
                        <Badge
                          variant="outline"
                          className="w-fit bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white"
                        >
                          ${product.price}
                        </Badge>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 line-through">
                          ${product.originalPrice}
                        </span>
                      </>
                    ) : (
                      <Badge variant="outline" className="w-fit border-zinc-200 dark:border-zinc-700">
                        ${product.price}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardFooter className="p-3 pt-0 relative z-10">
                  <motion.div whileTap={{ scale: 0.95 }} className="w-full">
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900"
                      onClick={() => showProductDetails(product)}
                    >
                      View Details
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }

  const renderCart = () => (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="p-4">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xl font-bold mb-4 flex items-center"
      >
        <ShoppingCart className="h-5 w-5 mr-2" />
        Shopping Cart
      </motion.h2>

      {cart.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center py-12 px-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
            <ShoppingCart className="h-8 w-8 text-zinc-500 dark:text-zinc-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">
            Looks like you haven't added any items to your cart yet
          </p>
          <Button
            onClick={() => setView("products")}
            className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900"
          >
            Continue Shopping
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {cart.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              exit={{ opacity: 0, x: -20 }}
              layout
              className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-md relative before:absolute before:inset-0 before:z-0 before:border before:border-zinc-100 before:dark:border-zinc-800 before:rounded-xl before:translate-x-0.5 before:translate-y-0.5"
            >
              <div className="flex p-3 relative z-10">
                <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={item.product.image || "/placeholder.svg?height=400&width=300"}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 pl-3">
                  <h3 className="font-medium text-sm">{item.product.name}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">One-of-a-kind item</p>
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      {item.product.originalPrice ? (
                        <div className="flex items-center gap-1">
                          <p className="font-semibold">${item.product.price}</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-through">
                            ${item.product.originalPrice}
                          </p>
                        </div>
                      ) : (
                        <p className="font-semibold">${item.product.price}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.div whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-full border-zinc-200 dark:border-zinc-700"
                          onClick={() => updateCartItemQuantity(index, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                      </motion.div>
                      <span className="text-sm w-5 text-center">{item.quantity}</span>
                      <motion.div whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-full border-zinc-200 dark:border-zinc-700"
                          onClick={() => updateCartItemQuantity(index, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-zinc-200 dark:border-zinc-800 p-2 relative z-10">
                <motion.div whileTap={{ scale: 0.98 }} className="w-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(index)}
                    className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    Remove
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-md bg-zinc-50 dark:bg-zinc-900/50"
          >
            <div className="p-4">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-zinc-500 dark:text-zinc-400">Subtotal</span>
                <span>${getTotalPrice()}</span>
              </div>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-zinc-500 dark:text-zinc-400">Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-zinc-200 dark:border-zinc-700 my-2 pt-2">
                <div className="flex justify-between items-center font-bold">
                  <span>Total</span>
                  <span>${getTotalPrice()}</span>
                </div>
              </div>
            </div>
            <div className="p-4 pt-0">
              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900"
                  size="lg"
                  onClick={() => {
                    // Process the order
                    alert("Order placed successfully!")
                    // Clear the cart
                    setCart([])
                    // Navigate back to products view
                    setView("products")
                  }}
                >
                  Checkout
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )

  // Only show UI when mounted to avoid hydration errors with theme
  if (!mounted) return null

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 p-4 flex justify-between items-center"
      >
        <motion.h1
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-xl font-bold cursor-pointer"
          onClick={() => {
            setView("products")
            handleTitleTap()
          }}
        >
          Jericho
        </motion.h1>
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </motion.div>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="ghost" size="icon" onClick={() => setView("cart")} className="relative rounded-full">
              <ShoppingCart className="h-5 w-5" />
              <AnimatePresence>
                {cart.length > 0 && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-2 -right-2"
                  >
                    <Badge className="h-5 w-5 flex items-center justify-center p-0 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                      {cart.length}
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>
      </motion.header>

      {/* Decorative header accent */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-900 via-zinc-500 to-zinc-900 dark:from-white dark:via-zinc-500 dark:to-white"
      />

      <AnimatePresence mode="wait">
        {view === "products" && (
          <motion.main key="products" className="flex-1">
            {renderProductsList()}
          </motion.main>
        )}
        {view === "details" && (
          <motion.main key="details" className="flex-1">
            {renderProductDetails()}
          </motion.main>
        )}
        {view === "cart" && (
          <motion.main key="cart" className="flex-1">
            {renderCart()}
          </motion.main>
        )}
        {view === "promotion" && (
          <motion.main key="promotion" className="flex-1">
            {renderPromotionDetails()}
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  )
}
