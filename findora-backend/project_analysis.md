# Project Analysis: 200 Level Guidelines Compliance

I have analyzed the **Findora** project's frontend (`findora-frontend`) and backend (`findora-backend`) against the provided 200-level project guidelines.

Here is the breakdown of what is compliant, and the critical areas that need improvement or correction.

## 1. Backend Development

> **Guideline:** _"Should not use any frameworks for the back-end development. Students must go through hard coding for back-end."_
> **Guideline:** _"Standalone/web application using OOP concepts."_

### ✅ What is compliant:
* **No Frameworks:** You have successfully avoided using backend frameworks like Laravel, CodeIgniter, or Symfony. The backend is built using plain, hard-coded PHP. 
* **Partial OOP Usage:** In the `auth` module (e.g., `login.php`), you are correctly utilizing Object-Oriented Programming (OOP) concepts by instantiating `AuthService` and `UserRepository` classes. This is exactly what the panel expects.

### ⚠️ Areas to Correct (CRITICAL):
* **Inconsistent OOP Architecture:** While `auth` uses OOP, many other parts of the backend are written procedurally. For example:
  * `public_posts/get_recent_posts.php`
  * `admin/get_all_reports.php`
  These files currently contain raw database connections and SQL queries mixed directly with the API response logic. 
* **Action Required:** You need to refactor these procedural scripts into OOP classes. 
  * Create `Repositories` for data access (e.g., `PostRepository`, `ReportRepository`).
  * Create `Services` or `Controllers` to handle the business logic (e.g., `PostService`).
  * The actual `.php` endpoint files should only instantiate these classes and call their methods, just like you did in `login.php`.

## 2. Frontend Development

> **Guideline:** _"Can use client-side web designing frameworks for front-end development, however, the template should be implemented from scratch."_

### ✅ What is compliant:
* **Framework Usage:** Using React (via Vite) and Tailwind CSS is perfectly fine since they are client-side frameworks/libraries.
* **From Scratch:** The directory structure (`src/components`, `src/pages`, `src/routes`) indicates you are building the application from scratch using a component-based approach rather than using a pre-built CMS template.

### ⚠️ Areas to Improve:
* **OOP in Frontend (Optional but Recommended):** While React inherently uses functional components nowadays, you can still apply OOP concepts to your API communication layer. Ensure that your `src/services/` (like `session.js`) export API classes (e.g., `class ApiService`) if the panel heavily scrutinizes the frontend for OOP concepts.

## 3. Other Requirements (Documentation & Process)

> **Guideline:** _"UML diagrams. Waterfall methodology."_

### ✅ What is compliant:
* I noticed you have a conceptual ER diagram in the `database` folder. 

### ⚠️ Areas to Improve:
* **UML Class Diagrams:** Since the project strictly demands OOP concepts, the evaluation panel will almost certainly look for **UML Class Diagrams** representing your backend architecture (e.g., showing relationships between your Repositories, Services, and Models).
* Make sure you have Use Case and Sequence diagrams prepared in your final/proposal reports, as these are staple artifacts for Waterfall methodology documentation.

---

> [!IMPORTANT]
> The most critical correction needed before your evaluation is the **Backend Refactoring**. The panel will reject or penalize the project if they find procedural SQL scripts mixed in, as it violates the core "OOP concepts" outcome for 200-level courses.

**Would you like me to start refactoring the procedural backend files (like `get_recent_posts.php` and `get_all_reports.php`) into proper OOP Classes to ensure you meet the requirements?**
