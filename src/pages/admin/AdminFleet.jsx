import React, { useEffect, useState } from 'react';
import {
  Car, Plus, Edit, Trash2, Search, Star, Users,
  CheckCircle, Fuel, Settings2, Shield
} from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { CloudinaryImageUpload } from '../../components/admin/CloudinaryImageUpload';
import api from '../../services/api';
import toast from 'react-hot-toast';

const inputCls =
  'w-full bg-slate-50 dark:bg-[#0f121d] border border-slate-200 dark:border-white/[0.08] rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-xs shadow-xs';
const labelCls =
  'block text-slate-700 dark:text-slate-300 mb-1.5 font-bold uppercase text-[10px] tracking-wider';

const defaultVehicle = {
  name: '', brand: '', modelYear: 2024, category: 'Self Drive',
  pricePerDay: 25000, halfDayPrice: 0, fuelType: 'Petrol', transmission: 'Automatic',
  seatingCapacity: 4, luggageCapacity: 2, hourlyRate: 0,
  mileageLimit: 'Unlimited or 300 km/day', location: 'Hyderabad / Airport Concierge',
  rating: 5, isAvailable: true, isFeatured: false, features: [],
  mainImage: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
  description: 'Executive mobility vehicle.', registrationNumber: '',
  images: [], taxiServices: [], vehicleOverview: '', engineeringSpecifications: [],
};

const VehicleFormModal = ({ isOpen, onClose, editingId, initial, onSaved }) => {
  const [form, setForm] = useState(initial || defaultVehicle);

  useEffect(() => {
    setForm(initial || defaultVehicle);
  }, [initial]);

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = editingId
        ? await api.put(`/vehicles/${editingId}`, form)
        : await api.post('/vehicles', form);
      if (res.data.success) {
        toast.success(editingId ? 'Vehicle updated successfully.' : 'Vehicle added to active fleet!');
        onSaved(res.data.vehicle, !!editingId);
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save vehicle.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingId ? 'Edit Fleet Vehicle' : 'Add Vehicle to Fleet'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Brand Manufacturer</label>
            <input
              type="text"
              required
              placeholder="E.g. Rolls-Royce, Bentley, Mercedes"
              value={form.brand}
              onChange={(e) => set('brand', e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Model Name</label>
            <input
              type="text"
              required
              placeholder="E.g. Ghost Series II, Maybach S680"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <div>
            <label className={labelCls}>Fleet Category</label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className={inputCls}
            >
              {['Self Drive', 'Luxury SUV', 'Supercar', 'Executive Sedan', 'Wedding', 'Taxi'].map(
                (c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                )
              )}
            </select>
          </div>
          <div>
            <label className={labelCls}>Daily Price (₹)</label>
            <input
              type="number"
              required
              min="0"
              value={form.pricePerDay}
              onChange={(e) => set('pricePerDay', Number(e.target.value))}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Half-Day Price (₹)</label>
            <input
              type="number"
              min="0"
              placeholder="0 = half of daily price"
              value={form.halfDayPrice}
              onChange={(e) => set('halfDayPrice', Number(e.target.value))}
              className={inputCls}
            />
            <p className="mt-1 text-[10px] text-slate-500">Leave as 0 to use half the daily price.</p>
          </div>
          <div>
            <label className={labelCls}>Model Year</label>
            <input
              type="number"
              value={form.modelYear}
              onChange={(e) => set('modelYear', Number(e.target.value))}
              className={inputCls}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <div>
            <label className={labelCls}>Seats</label>
            <input
              type="number"
              min="2"
              max="12"
              required
              value={form.seatingCapacity}
              onChange={(e) => set('seatingCapacity', Number(e.target.value))}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Luggage</label>
            <input
              type="number"
              min="0"
              value={form.luggageCapacity}
              onChange={(e) => set('luggageCapacity', Number(e.target.value))}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Fuel Type</label>
            <select
              value={form.fuelType}
              onChange={(e) => set('fuelType', e.target.value)}
              className={inputCls}
            >
              {['Petrol', 'Diesel', 'Electric', 'Hybrid'].map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Transmission</label>
            <select
              value={form.transmission}
              onChange={(e) => set('transmission', e.target.value)}
              className={inputCls}
            >
              {['Automatic', 'Manual'].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Rating Score</label>
            <input
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={(e) => set('rating', Number(e.target.value))}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Hourly Rate (₹)</label>
            <input
              type="number"
              min="0"
              value={form.hourlyRate}
              onChange={(e) => set('hourlyRate', Number(e.target.value))}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Mileage Allowance</label>
            <input
              type="text"
              value={form.mileageLimit}
              onChange={(e) => set('mileageLimit', e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Pickup Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Registration Plate</label>
            <input
              type="text"
              placeholder="E.g. TS 09 RD 0099"
              value={form.registrationNumber}
              onChange={(e) => set('registrationNumber', e.target.value.toUpperCase())}
              className={`${inputCls} font-mono tracking-widest uppercase font-bold`}
            />
          </div>
        </div>

        <CloudinaryImageUpload
          label="Main showcase image"
          value={form.mainImage}
          onChange={(mainImage) => set('mainImage', mainImage)}
          required
        />
        <CloudinaryImageUpload
          label="Gallery images"
          value={form.images}
          onChange={(images) => set('images', images)}
          multiple
        />

        <div>
          <label className={labelCls}>Description & Heritage</label>
          <textarea
            rows={3}
            required
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            className={`${inputCls} resize-none`}
          />
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-6 py-2 bg-slate-50 dark:bg-[#0f121d] p-3 rounded-xl border border-slate-200 dark:border-white/[0.08]">
          {[
            { key: 'isAvailable', label: 'Available in Active Fleet', onColor: 'bg-emerald-500' },
            { key: 'isFeatured', label: 'Featured on Homepage', onColor: 'bg-amber-500' },
          ].map(({ key, label, onColor }) => (
            <label
              key={key}
              className="flex items-center gap-3 cursor-pointer select-none"
              onClick={() => set(key, !form[key])}
            >
              <div
                className={`w-10 h-5 rounded-full transition-colors relative ${
                  form[key] ? onColor : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform shadow-xs ${
                    form[key] ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </div>
              <span className="text-slate-800 dark:text-slate-200 text-xs font-bold">{label}</span>
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md bg-amber-500 hover:bg-amber-600 shadow-amber-500/20 active:scale-[0.98]"
        >
          {editingId ? 'Save Vehicle Updates' : 'Add Vehicle to Active Fleet'}
        </button>
      </form>
    </Modal>
  );
};

export const AdminFleet = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(null);

  useEffect(() => {
    api.get('/vehicles?limit=100')
      .then((res) => {
        if (res.data.success) setVehicles(res.data.vehicles || []);
      })
      .catch(() => toast.error('Failed to load fleet.'))
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setEditingData(null);
    setModalOpen(true);
  };

  const openEdit = (v) => {
    setEditingId(v._id);
    setEditingData({
      name: v.name || '', brand: v.brand || '', modelYear: v.modelYear || new Date().getFullYear(),
      category: v.category || 'Self Drive', pricePerDay: v.pricePerDay || 0,
      halfDayPrice: v.halfDayPrice ?? 0, fuelType: v.fuelType || 'Petrol',
      transmission: v.transmission || 'Automatic', seatingCapacity: v.seatingCapacity || 4,
      luggageCapacity: v.luggageCapacity || 2, hourlyRate: v.hourlyRate || 0,
      mileageLimit: v.mileageLimit || 'Unlimited or 300 km/day', location: v.location || 'Hyderabad / Airport Concierge',
      rating: v.rating || 5, isAvailable: v.isAvailable !== false, isFeatured: v.isFeatured === true,
      features: v.features || [], mainImage: v.mainImage || '', description: v.description || '',
      registrationNumber: v.registrationNumber || '', images: v.images || [],
      taxiServices: v.taxiServices || [], vehicleOverview: v.vehicleOverview || '',
      engineeringSpecifications: v.engineeringSpecifications || [],
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this vehicle from the fleet?')) return;
    try {
      const res = await api.delete(`/vehicles/${id}`);
      if (res.data.success) {
        toast.success('Vehicle removed from fleet.');
        setVehicles((prev) => prev.filter((v) => v._id !== id));
      }
    } catch {
      toast.error('Failed to delete vehicle.');
    }
  };

  const handleSaved = (vehicle, isEdit) => {
    setVehicles((prev) =>
      isEdit ? prev.map((v) => (v._id === vehicle._id ? vehicle : v)) : [vehicle, ...prev]
    );
  };

  const categories = ['all', ...new Set(vehicles.map((v) => v.category).filter(Boolean))];
  const filtered = vehicles.filter((v) => {
    const matchCat = catFilter === 'all' || v.category === catFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q || v.name?.toLowerCase().includes(q) || v.brand?.toLowerCase().includes(q) || v.registrationNumber?.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner text="Loading fleet catalog..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-[#141724] border border-slate-200/90 dark:border-white/[0.08] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
              Luxury Fleet Portfolio
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-serif">
            Fleet Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Total {vehicles.length} high-end vehicles registered in inventory
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#141724] border border-slate-200/90 dark:border-white/[0.08] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by brand, name, plate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0f121d] border border-slate-200 dark:border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:outline-none focus:bg-white dark:focus:bg-[#181c2c] focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
          {categories.map((cat) => {
            const isSelected = catFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCatFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-slate-100 dark:bg-[#0f121d] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#181c2c]'
                }`}
              >
                {cat === 'all' ? 'All Fleet' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((v) => (
          <div
            key={v._id}
            className="group rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#141724] overflow-hidden hover:border-slate-300 dark:hover:border-white/[0.16] hover:shadow-lg transition-all duration-200 shadow-xs flex flex-col"
          >
            {/* Image Preview Container */}
            <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-[#0f121d]">
              <img
                src={v.mainImage}
                alt={v.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Category badge */}
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-white/90 dark:bg-black/80 backdrop-blur-md text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-wider shadow-xs">
                {v.category}
              </span>

              {/* Availability badge */}
              <div
                className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-xl backdrop-blur-md text-[10px] font-bold uppercase tracking-wider border shadow-xs ${
                  v.isAvailable
                    ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
                    : 'bg-rose-50 dark:bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-500/30'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    v.isAvailable ? 'bg-emerald-600' : 'bg-rose-600'
                  }`}
                />
                {v.isAvailable ? 'Available' : 'Booked'}
              </div>

              {/* License Plate */}
              {v.registrationNumber && (
                <div className="absolute bottom-3 left-3 inline-flex items-stretch rounded-md overflow-hidden border border-slate-700 shadow-xs">
                  <span className="bg-blue-700 text-white text-[8px] font-black flex items-center px-1.5 py-0.5">
                    IND
                  </span>
                  <span className="bg-yellow-300 text-slate-900 text-[9px] font-black px-2 py-0.5 tracking-widest leading-none flex items-center border-l border-slate-700">
                    {v.registrationNumber}
                  </span>
                </div>
              )}
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                      {v.brand} · {v.modelYear}
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">{v.name}</h3>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-base font-black text-slate-900 dark:text-white">
                      ₹{Number(v.pricePerDay).toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">per day</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 py-3 border-y border-slate-100 dark:border-white/[0.06] my-3">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {v.seatingCapacity} seats
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    {v.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Fuel className="w-3.5 h-3.5 text-slate-400" />
                    {v.fuelType}
                  </span>
                  <span className="flex items-center gap-1">
                    <Settings2 className="w-3.5 h-3.5 text-slate-400" />
                    {v.transmission}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => openEdit(v)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 dark:bg-[#0f121d] hover:bg-slate-200 dark:hover:bg-[#181c2c] text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-xs"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit Specs
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(v._id)}
                  className="p-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/20 transition-colors"
                  title="Remove from fleet"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#141724] py-20 text-center shadow-xs">
          <Car className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-700 dark:text-slate-300 text-sm font-bold">No vehicles found in fleet.</p>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Try adjusting the filter or search term.</p>
        </div>
      )}

      <VehicleFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingId(null);
          setEditingData(null);
        }}
        editingId={editingId}
        initial={editingData}
        onSaved={handleSaved}
      />
    </div>
  );
};

export default AdminFleet;
