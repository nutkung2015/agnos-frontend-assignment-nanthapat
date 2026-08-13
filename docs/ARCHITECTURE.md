# สถาปัตยกรรมระบบและการออกแบบเชิงลึก (System Architecture & Design Decisions)

เอกสารนี้รวบรวมรายละเอียดทางเทคนิคเชิงลึก แผนผังการทำงาน การตัดสินใจด้าน UI/UX และการปฏิบัติตามมาตรฐานการเข้าถึง (Accessibility) สำหรับระบบ Real-Time Patient Intake & Staff Monitoring

---

## 1. โครงสร้าง Component Architecture

```
                               ┌───────────────────────────┐
                               │       Root Layout         │
                               │ (Inter + Noto Sans Thai)  │
                               └─────────────┬─────────────┘
                                             │
                      ┌──────────────────────┼──────────────────────┐
                      ▼                      ▼                      ▼
             ┌─────────────────┐   ┌───────────────────┐   ┌─────────────────┐
             │  Patient Form   │   │    Staff View     │   │   Split Demo    │
             │ (/patient-form) │   │   (/staff-view)   │   │     (/demo)     │
             └────────┬────────┘   └─────────┬─────────┘   └────────┬────────┘
                      │                      │                      │
     ┌────────────────┴───────────────┐      │                      │
     │ - PersonalInfoSection          │      │                      │
     │ - ContactInfoSection           │      │                      │
     │ - EmergencySection             │      │                      │
     │ - AutoSaveIndicator            │      │                      │
     │ - SubmitSuccessScreen          │      │                      │
     └────────────────────────────────┘      │                      │
                                             │                      │
                       ┌─────────────────────┴──────────────┐       │
                       │ - StatusBadge (Filling/Inactive/Sub)│◄──────┤
                       │ - LiveFieldCard (Highlight flash)  │       │
                       │ - ConnectionStatus (Live ping)     │       │
                       │ - LastUpdatedTimer (Relative time) │       │
                       └────────────────────────────────────┘       │
                                             ▲                      │
                                             │  Zustand Stores      │
                                             ├──────────────────────┘
                                             ▼
                                  ┌─────────────────────┐
                                  │ - patient-form.store│
                                  │ - socket.store      │
                                  └─────────────────────┘
```

---

## 2. การออกแบบ UI/UX & มาตรฐานความ Responsive

### 1. Mobile-First Approach (ฝั่งคนไข้)
* **Touch Target Size**: ปุ่มและ Input ทุกช่องมีขนาดขั้นต่ำ 44x44px เหมาะสำหรับการใช้งานผ่านสมาร์ตโฟน
* **Visual Chunking**: แบ่งกลุ่มข้อมูลเป็น 3 การ์ดหลัก (ข้อมูลส่วนตัว, ข้อมูลการติดต่อ, บุคคลติดต่อฉุกเฉิน) เพื่อลด Cognitive Load
* **Auto-Save Indicator**: แสดงสถานะการบันทึกอัตโนมัติแบบเรียลไทม์ (กำลังซิงค์ / บันทึกแล้ว / ออฟไลน์)

### 2. Desktop Monitoring Dashboard (ฝั่งเจ้าหน้าที่)
* **Multi-column Grid Layout**: จัดวางข้อมูลให้เห็นภาพรวมของคนไข้ทุกช่องในหน้าจอเดียว
* **Live Field Highlighting**: มี Effect แสงกะพริบแจ้งเตือนทันทีที่มีการเปลี่ยนแปลงข้อมูลในแต่ละฟิลด์

### 3. มาตรฐานการเข้าถึง (WCAG 2.1 AA Accessibility)
* ทุก Form Control มี `<Label htmlFor="...">` กำกับชัดเจน
* มี `aria-invalid`, `aria-describedby`, และ `role="alert"` สำหรับ Error Message
* Color Contrast Ratio ผ่านเกณฑ์ความคมชัด ≥ 4.5:1
* รองรับ Keyboard Navigation (Tab Order สมบูรณ์)

---

## 3. Real-Time Synchronization Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor P as Patient (Patient Form)
    participant C as Next.js Client
    participant S as Socket.io Server (Express)
    participant DB as PostgreSQL (Supabase)
    actor V as Staff (Staff View)

    Note over P,V: เริ่มต้นการทำงาน (Session Isolation ด้วย Patient ID)
    P->>C: เปิด /patient-form?id=patient-001
    C->>S: emit("join-room", { patientId: "patient-001" })
    V->>S: emit("join-room", { patientId: "patient-001" })
    V->>S: GET /api/patients/patient-001 (REST Fallback Snapshot)
    S-->>V: ส่งข้อมูลเริ่มต้นล่าสุดจาก DB ทันที

    Note over P,V: ขณะผู้ป่วยกำลังกรอกข้อมูล (Keystroke Realtime Sync)
    P->>C: พิมพ์ข้อมูลในฟอร์ม (Debounce 300ms)
    C->>S: emit("patient-update", { patientId, data, status: "filling" })
    S->>DB: Prisma upsert Patient record
    S-->>V: broadcast("staff-update", updatedPatient)
    Note over V: แสดง Status ACTIVELY FILLING และ Live Flash Highlight

    Note over P,V: เมื่อผู้ป่วยหยุดพิมพ์นานกว่า 5 วินาที (Inactivity Detection)
    C->>S: emit("patient-update", { patientId, data, status: "inactive" })
    S-->>V: broadcast("staff-update", { status: "inactive" })
    Note over V: แสดง Status INACTIVE (หยุดพิมพ์)

    Note over P,V: เมื่อผู้ป่วยกดยืนยันส่งฟอร์ม (Submit)
    P->>C: กดปุ่ม "ยืนยันและส่งแบบฟอร์ม"
    C->>S: emit("patient-submit", { patientId, data })
    S->>DB: Prisma update status = "submitted"
    S-->>V: broadcast("staff-update", submittedPatient)
    Note over V: แสดง Status SUBMITTED และ Toast Notification แจ้งเตือน
```
