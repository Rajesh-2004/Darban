import { useState } from 'react'
import { emojiCategories } from '../constants.js'

const CategorySelector = ({ player, onSelect }) => {
  const [name, setName] = useState(`Player ${player}`)
  const categories = Object.keys(emojiCategories)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-xl flex items-center justify-center animate-fade-in z-50">
      <div className="bg-gray-950 bg-opacity-95 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-neon-pink max-w-md w-full animate-spring-up">
        <h2 className="text-3xl font-bold text-white mb-6 text-center animate-neon-flicker">
          Player {player}: Choose Category
        </h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`Player ${player} Name`}
          className="w-full p-3 mb-6 text-white bg-gray-800 border-2 border-neon-cyan rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-pink"
        />
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <button
              key={category}
              className="btn-neon btn-neon-purple flex items-center justify-center space-x-2"
              onClick={() => onSelect(player, category, name)}
            >
              <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
              <span>{emojiCategories[category][0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategorySelector