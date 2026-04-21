# Security Specification - PLATAFORMA LIFE

## 1. Data Invariants
- A student can only view their own payments and requests.
- Only users with the 'financial' role can create or update payments.
- Only users with the 'pedagogical' role can create or update grades and courses.
- Only users with the 'secretariat' role can update request statuses.
- Every write must have a valid `studentId` or `uid` that exists in the system (when applicable).
- Timestamps must be validated against `request.time`.

## 2. The Dirty Dozen (Vulnerable Payloads)
1. **Identity Spoofing**: Attempt to create a user profile with a different `uid` than the authenticated user.
2. **Role Escalation**: A student trying to update their own `role` to 'admin' in the `users` collection.
3. **Ghost Field Injection**: Adding `isVerified: true` to a payment record to bypass financial verification.
4. **Payment Modification**: A student trying to change the `status` of their own payment from 'Pendente' to 'Pago'.
5. **Grade Falsification**: A student trying to update their own grade record.
6. **Cross-User Leak**: A student attempting to `get` the payment record of another student.
7. **Resource Poisoning**: Injecting a 2MB string into a request `description`.
8. **Orphaned Record**: Creating a grade for a `subjectId` that doesn't exist.
9. **Timestamp Manipulation**: Setting `createdAt` to a date in the past instead of `request.time`.
10. **Terminal State Bypass**: Updating a 'Concluído' request back to 'Aberto'.
11. **Blanket Read Attack**: Querying the `payments` collection without a `studentId` filter.
12. **ID Collision Attack**: Using a very long and invalid string as a document ID.

## 3. Test Runner (Draft)
Verification will be performed during Phase 5 logic checks.
