import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { itemsService } from '../services/itemsService';
import type { StoryItem, CreateItemDto, UpdateItemDto } from '../services/itemsService';

interface ItemsPanelProps {
  storyId: string;
  isOpen: boolean;
  onToggle: () => void;
  onItemsChange?: (items: StoryItem[]) => void;
}

export const ItemsPanel: React.FC<ItemsPanelProps> = ({
  storyId,
  isOpen,
  onToggle,
  onItemsChange,
}) => {
  const [items, setItems] = useState<StoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingItem, setEditingItem] = useState<StoryItem | null>(null);

  // Form state
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');

  const loadItems = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await itemsService.getItems(storyId);
      setItems(data);
    } catch (err) {
      setError('Failed to load items');
      console.error('Error loading items:', err);
    } finally {
      setIsLoading(false);
    }
  }, [storyId]);

  useEffect(() => {
    if (isOpen && storyId) {
      loadItems();
    }
  }, [isOpen, storyId, loadItems]);

  useEffect(() => {
    onItemsChange?.(items);
  }, [items, onItemsChange]);

  const resetForm = () => {
    setItemName('');
    setItemDescription('');
    setEditingItem(null);
    setShowCreateForm(false);
  };

  const handleCreateItem = async () => {
    if (!itemName.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      const data: CreateItemDto = {
        name: itemName.trim(),
        description: itemDescription.trim() || undefined,
      };

      await itemsService.createItem(storyId, data);
      await loadItems();
      resetForm();
    } catch (err) {
      setError('Failed to create item');
      console.error('Error creating item:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem || !itemName.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      const data: UpdateItemDto = {
        name: itemName.trim(),
        description: itemDescription.trim() || undefined,
      };

      await itemsService.updateItem(storyId, editingItem.id, data);
      await loadItems();
      resetForm();
    } catch (err) {
      setError('Failed to update item');
      console.error('Error updating item:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      setIsLoading(true);
      setError(null);
      await itemsService.deleteItem(storyId, itemId);
      await loadItems();
    } catch (err) {
      setError('Failed to delete item');
      console.error('Error deleting item:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (item: StoryItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemDescription(item.description || '');
    setShowCreateForm(true);
  };

  if (!isOpen) {
    return (
      <div className="absolute top-20 left-4 z-10">
        <Button onClick={onToggle} size="sm" variant="outline">
          Items
        </Button>
      </div>
    );
  }

  return (
    <div className="absolute top-20 left-4 z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-96 max-h-96 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Items</h3>
        <Button onClick={onToggle} size="sm" variant="outline">
          Hide
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {isLoading && items.length === 0 ? (
          <div className="text-center py-4 text-gray-500">Loading items...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No items yet</div>
        ) : (
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{item.name}</div>
                  {item.description && (
                    <div className="text-xs text-gray-500 truncate">{item.description}</div>
                  )}
                </div>
                <div className="flex space-x-1 ml-2">
                  <Button
                    onClick={() => startEditing(item)}
                    size="sm"
                    variant="outline"
                    disabled={isLoading}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteItem(item.id)}
                    size="sm"
                    variant="outline"
                    disabled={isLoading}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showCreateForm && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">
              {editingItem ? 'Edit Item' : 'Create Item'}
            </h4>
            <div className="space-y-3">
              <Input
                placeholder="Item name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                disabled={isLoading}
              />

              <Input
                placeholder="Description (optional)"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                disabled={isLoading}
              />

              <div className="flex space-x-2">
                <Button
                  onClick={editingItem ? handleUpdateItem : handleCreateItem}
                  size="sm"
                  disabled={isLoading || !itemName.trim()}
                  className="flex-1"
                >
                  {isLoading ? 'Saving...' : (editingItem ? 'Update' : 'Create')}
                </Button>
                <Button
                  onClick={resetForm}
                  size="sm"
                  variant="outline"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {!showCreateForm && (
        <div className="border-t pt-4">
          <Button
            onClick={() => setShowCreateForm(true)}
            size="sm"
            className="w-full"
            disabled={isLoading}
          >
            Add Item
          </Button>
        </div>
      )}
    </div>
  );
};