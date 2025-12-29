# 🔋 Battery Configuration & Costing System (Angular-Only)

## 📌 Overview

This project is an **enterprise-style battery configuration and costing system** built **entirely in Angular**, without any backend.
All business logic, master data, calculations, and pricing rules are driven by **JSON files stored in the `assets` folder**.

The application simulates a **real-world engineering configurator** used in EV, energy storage, and battery pack design platforms.

---

## 🎯 Key Objectives

* Build a **JSON-driven, frontend-only enterprise system**
* Implement **cascading selections** based on engineering constraints
* Perform **deterministic calculations** (voltage, capacity, total cells)
* Apply **quantity-based pricing (USD/kWh)** at pack level
* Maintain **clean separation of concerns**
* Keep the system **future-ready for backend integration**

---

## 🏗️ System Architecture

```
Angular UI (Reactive Forms)
        ↓
Services Layer
        ↓
JSON Assets (Master Data, Pricing, Formulas)
```

### 🔹 No Backend

* No API calls
* No database
* No server-side logic

Everything runs **inside Angular**.

---

## 📁 Project Structure

```
src/
 ├── assets/
 │    ├── master-data/
 │    │    └── battery-master.json
 │    └── schemas/
 │
 ├── app/
 │    ├── core/
 │    │    ├── services/
 │    │    │    ├── master-data.service.ts
 │    │    │    ├── config-session.service.ts
 │    │    │    ├── calculation.service.ts
 │    │    │    └── pricing.service.ts
 │    │    └── models/
 │    │
 │    ├── features/
 │    │    └── battery-configurator/
 │    │         ├── battery-configurator.component.ts
 │    │         ├── battery-configurator.component.html
 │    │         └── battery-configurator.component.scss
 │
 └── app.component.ts
```

---

## 📦 Master Data (JSON-Driven)

All domain data lives in `assets/master-data/battery-master.json`.

### Data Hierarchy

```
Battery Chemistry
 └── Cell Manufacturer
      └── Form Factor (21700 / 18650)
           └── Cell Model
                ├── Capacity (Ah)
                ├── Voltage (V)
                └── Pricing Tiers (USD/kWh)
```

📌 **Master data is read-only and versionable**

---

## 🔁 Cascading Dependency Rules

Selections must follow this strict order:

1. Battery Chemistry
2. Cell Manufacturer
3. Form Factor
4. Cell Model

Changing a higher-level selection **automatically resets all dependent fields**.

---

## 🧮 Calculations (Auto-Derived)

The following values are **auto-calculated**:

| Parameter             | Formula                      |
| --------------------- | ---------------------------- |
| Battery Voltage (V)   | `cellVoltage × series`       |
| Battery Capacity (Ah) | `cellCapacity × parallel`    |
| Total Cells           | `series × parallel`          |
| Energy per Cell (Wh)  | `cellVoltage × cellCapacity` |

All calculations:

* Run on the frontend
* Are isolated in `CalculationService`
* Are deterministic and testable

---

## 💰 Pricing Logic (USD/kWh)

* Pricing is defined per **cell model**
* Uses **quantity-based slabs**
* Pricing is calculated at **battery pack level**
* Implemented via `PricingService`

Example slabs:

* 1–100 cells
* 101–500 cells
* 501–1000 cells

---

## 🧠 Angular Design Principles

* **Reactive Forms** for state handling
* **Services for business logic**
* **Components for UI only**
* **No hard-coded rules**
* **JSON as single source of truth**

This ensures:

* Maintainability
* Scalability
* Easy backend migration later

---

## 🚀 How to Run

```bash
npm install
ng serve
```

Navigate to:

```
http://localhost:4200
```

---

## 🧪 Extensibility

This system is designed to easily support:

* Backend APIs (future)
* NgRx state management
* Thermal & BMS parameters
* Lifecycle & degradation modeling
* Supplier contracts & regional pricing
* Excel import/export

---

## 🎓 Why This Project Matters

This project demonstrates:

* Enterprise-level frontend architecture
* Real-world engineering problem solving
* Clean Angular service-driven design
* JSON-driven UI patterns used in large systems

It is **interview-ready** for:

* Angular Developer
* Frontend Engineer
* Full-Stack Engineer (UI-heavy)
* EV / Energy domain roles

---

## 👤 Author

**Shubham**
Angular Developer | UI Engineer
