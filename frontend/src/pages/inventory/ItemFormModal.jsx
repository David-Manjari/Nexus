import { useState } from "react";
import { createItem, updateItem } from "../../api/inventory";
import InventoryModal from "./InventoryModal";

function validate(values, existingItems, editingId) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Name is required";
  if (!values.category.trim()) errors.category = "Category is required";
  if (!values.sku.trim()) errors.sku = "SKU or serial number is required";
  const clash = existingItems.some(
    (i) => i.id !== editingId && i.sku.toLowerCase() === values.sku.trim().toLowerCase()
  );
  if (clash) errors.sku = "This SKU already exists";
  return errors;
}

export default function ItemFormModal({ type, item, existingItems, onClose, onSaved }) {
  const [values, setValues] = useState({
    name: item?.name ?? "",
    category: item?.category ?? "",
    brand: item?.brand ?? "",
    sku: item?.sku ?? "",
    status: item?.status ?? "available",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [saving, setSaving] = useState(false);

  const change = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validate(values, existingItems, item?.id);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    setApiError(null);
    const data = {
      name: values.name.trim(),
      category: values.category.trim(),
      brand: values.brand.trim(),
      sku: values.sku.trim(),
    };
    if (item?.status !== "assigned") data.status = values.status;

    try {
      if (item) await updateItem(item.id, data);
      else await createItem(type, data);
      onSaved();
    } catch (err) {
      setApiError(err.message);
      setSaving(false);
    }
  }

  return (
    <InventoryModal title={item ? `Edit ${item.name}` : `Add ${type}`} onClose={onClose}>
      <form className="inv-form" onSubmit={handleSubmit} noValidate>
        <label>
          Name
          <input name="name" value={values.name} onChange={change} />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>
        <label>
          Category
          <input name="category" value={values.category} onChange={change} />
          {errors.category && <span className="field-error">{errors.category}</span>}
        </label>
        <label>
          Brand
          <input name="brand" value={values.brand} onChange={change} />
        </label>
        <label>
          SKU / serial number
          <input name="sku" value={values.sku} onChange={change} />
          {errors.sku && <span className="field-error">{errors.sku}</span>}
        </label>
        {item?.status !== "assigned" && (
          <label>
            Status
            <select name="status" value={values.status} onChange={change}>
              <option value="available">available</option>
              <option value="maintenance">maintenance</option>
            </select>
          </label>
        )}
        {apiError && <p className="inventory-error">{apiError}</p>}
        <div className="inv-form-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
        </div>
      </form>
    </InventoryModal>
  );
}