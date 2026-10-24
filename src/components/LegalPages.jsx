import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  FileText, 
  Truck, 
  RefreshCcw, 
  Mail, 
  Phone, 
  MapPin,
  Lock,
  Scale,
  AlertCircle
} from 'lucide-react';

export default function LegalPages({ initialTab = 'privacy', onBackToStore }) {
  const [currentPolicy, setCurrentPolicy] = useState(initialTab);

  return (
    <div className="container" style={{ padding: '40px 24px 80px', maxWidth: '920px' }}>
      {/* Navigation Return */}
      <button 
        className="btn btn-secondary btn-sm"
        onClick={onBackToStore}
        style={{ marginBottom: '24px' }}
      >
        <ArrowLeft size={14} />
        Back to Products Catalog
      </button>

      {/* Policy Navigation Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '32px',
        scrollbarWidth: 'none'
      }}>
        <button
          className={`filter-pill ${currentPolicy === 'privacy' ? 'active' : ''}`}
          onClick={() => setCurrentPolicy('privacy')}
        >
          Privacy Policy
        </button>
        <button
          className={`filter-pill ${currentPolicy === 'terms' ? 'active' : ''}`}
          onClick={() => setCurrentPolicy('terms')}
        >
          Terms & Conditions
        </button>
        <button
          className={`filter-pill ${currentPolicy === 'shipping' ? 'active' : ''}`}
          onClick={() => setCurrentPolicy('shipping')}
        >
          Shipping & Delivery Policy
        </button>
        <button
          className={`filter-pill ${currentPolicy === 'refunds' ? 'active' : ''}`}
          onClick={() => setCurrentPolicy('refunds')}
        >
          Cancellation & Refund Policy
        </button>
        <button
          className={`filter-pill ${currentPolicy === 'contact' ? 'active' : ''}`}
          onClick={() => setCurrentPolicy('contact')}
        >
          Contact & Grievance Redressal
        </button>
      </div>

      {/* =========================================================================
          1. DETAILED PRIVACY POLICY
         ========================================================================= */}
      {currentPolicy === 'privacy' && (
        <div className="glass-card" style={{ padding: '40px 36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Lock size={18} color="#ffffff" />
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.06em', fontWeight: 600 }}>
              Information Technology Act, 2000 & IT Rules 2011 Compliant
            </span>
          </div>

          <h1 style={{ fontSize: '2.2rem', marginBottom: '6px', color: '#ffffff' }}>Privacy Policy</h1>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '28px' }}>
            Effective Date: October 24, 2026 • THE BIG PITCH (Physical Founder Hardware & Goods)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
            <section>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>1. Introduction & Overview</h3>
              <p>
                Welcome to <strong>THE BIG PITCH</strong> ("we", "us", "our", or the "Company"). We operate an e-commerce platform offering premium physical hardware, executive stationery, and founder merchandise delivered across India. We respect your privacy and are committed to protecting your personal data in accordance with the <em>Information Technology Act, 2000</em>, the <em>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</em>, and the <em>Digital Personal Data Protection Act, 2023</em>.
              </p>
              <p style={{ marginTop: '8px' }}>
                This Privacy Policy explains how we collect, process, store, disclose, and safeguard your personal information when you visit our website, register an account, or purchase physical items.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>2. Categories of Information We Collect</h3>
              <p>To process your physical orders and communicate shipping progress, we collect the following categories of data:</p>
              <ul style={{ paddingLeft: '22px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>
                  <strong>Account Identification:</strong> Email address and encrypted password credentials managed securely via Supabase Auth.
                </li>
                <li>
                  <strong>Physical Delivery & Courier Coordinates:</strong> Recipient full name, verified 10-digit mobile contact number, detailed delivery address (building/flat name, street, landmarks, city, state, and 6-digit postal PIN code).
                </li>
                <li>
                  <strong>Transaction & Payment Identifiers:</strong> Razorpay payment identifiers (such as <code>razorpay_payment_id</code>, <code>razorpay_order_id</code>, and payment timestamp). <em>Note: All electronic payment processing is handled exclusively through Razorpay Software Private Limited. We never store, receive, or process your credit/debit card numbers, CVVs, net-banking passwords, or UPI PINs.</em>
                </li>
                <li>
                  <strong>Technical & Operational Logs:</strong> Browser user agent, device operating system, access timestamps, and IP addresses recorded for fraud prevention and error diagnosis.
                </li>
              </ul>
            </section>

            <section>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>3. Lawful Basis & Purpose of Processing</h3>
              <p>We process your personal information strictly for legitimate commercial and operational purposes, including:</p>
              <ul style={{ paddingLeft: '22px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>Fulfilling, inspecting, packing, and dispatching physical orders to your shipping address.</li>
                <li>Transmitting automated dispatch confirmations, tracking links (AWB numbers), and delivery status notifications via SMS and email.</li>
                <li>Handling 1-year hardware replacement warranty claims, customer support tickets, and courier tracking inquiries.</li>
                <li>Detecting and mitigating payment fraud, chargebacks, and unauthorized account access.</li>
                <li>Complying with statutory tax, invoicing, and corporate compliance obligations under Indian law.</li>
              </ul>
            </section>

            <section>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>4. Data Disclosure to Third Parties</h3>
              <p>We do not sell, rent, monetize, or trade your personal information. We disclose data solely to essential service providers as detailed below:</p>
              <ul style={{ paddingLeft: '22px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>
                  <strong>Third-Party Logistics Partners:</strong> We share your recipient name, delivery address, and contact phone number with contracted courier partners (e.g., Blue Dart Express, Delhivery, DTDC, FedEx India, Speed Post) strictly to achieve door-to-door delivery and delivery verification.
                </li>
                <li>
                  <strong>Payment Aggregator:</strong> Transaction metadata is transmitted to <strong>Razorpay</strong> over encrypted 256-bit TLS connections adhering to PCI-DSS Level 1 specifications.
                </li>
                <li>
                  <strong>Legal & Regulatory Authorities:</strong> We may disclose information if required to do so by applicable Indian court orders, subpoenas, or statutory law enforcement inquiries.
                </li>
              </ul>
            </section>

            <section>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>5. Security Safeguards & Data Retention</h3>
              <p>
                We implement industry-standard technical, managerial, and physical security measures. All communications between your browser, our application, and Supabase servers are encrypted via HTTPS with TLS 1.3. User account data is segregated through PostgreSQL Row Level Security (RLS) policies.
              </p>
              <p style={{ marginTop: '8px' }}>
                We retain personal delivery and invoice data for as long as required to honor warranty commitments, settle disputes, and satisfy commercial tax accounting rules (typically 7 years as mandated under Indian tax regulations).
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>6. Your Statutory Rights</h3>
              <p>Under applicable Indian data protection laws, you retain the right to:</p>
              <ul style={{ paddingLeft: '22px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>Review, inspect, or correct your delivery address and profile information.</li>
                <li>Request account deletion or data erasure, subject to mandatory record retention laws for completed tax transactions.</li>
                <li>Withdraw consent for optional non-transactional marketing communications.</li>
              </ul>
            </section>

            <section>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>7. Grievance Officer Details</h3>
              <p>
                In compliance with the <em>Information Technology Act, 2000</em> and rules framed thereunder, the details of our Grievance Redressal Officer are as follows:
              </p>
              <div style={{ background: '#121215', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginTop: '8px' }}>
                <div><strong>Grievance Officer:</strong> Legal & Compliance Desk</div>
                <div><strong>Company:</strong> THE BIG PITCH</div>
                <div><strong>Email:</strong> <a href="mailto:grievance@thebigpitch.com" style={{ color: '#ffffff', textDecoration: 'underline' }}>grievance@thebigpitch.com</a></div>
                <div><strong>Registered Office:</strong> BKC Logistics Annex, Bandra Kurla Complex, Mumbai, Maharashtra 400051, India</div>
                <div><strong>Turnaround Time:</strong> Grievances will be redressed within 15 business days of receipt.</div>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* =========================================================================
          2. DETAILED TERMS & CONDITIONS
         ========================================================================= */}
      {currentPolicy === 'terms' && (
        <div className="glass-card" style={{ padding: '40px 36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Scale size={18} color="#ffffff" />
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.06em', fontWeight: 600 }}>
              Legally Binding Agreement
            </span>
          </div>

          <h1 style={{ fontSize: '2.2rem', marginBottom: '6px', color: '#ffffff' }}>Terms & Conditions</h1>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '28px' }}>
            Effective Date: October 24, 2026 • Governing Law: Jurisdiction of Mumbai, India
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
            <section>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>1. Contractual Relationship</h3>
              <p>
                These Terms & Conditions ("Terms") govern your access to and use of <strong>THE BIG PITCH</strong> e-commerce store and the purchase of physical goods, hardware, stationery, and apparel. By accessing the site, creating an account, or placing an order, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, you must cease using the platform.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>2. User Eligibility & Account Responsibilities</h3>
              <p>
                You must be at least 18 years of age and competent to enter into a legally binding contract under the <em>Indian Contract Act, 1872</em>. If you are registering on behalf of a company or legal entity, you represent and warrant that you hold full authorization to bind said entity to these Terms.
              </p>
              <p style={{ marginTop: '8px' }}>
                You are responsible for maintaining the confidentiality of your account credentials and password. Any actions executed through your account are deemed authorized by you.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>3. Products, Specifications & Inventory</h3>
              <p>
                All products offered on THE BIG PITCH represent physical goods manufactured with specified materials (e.g., anodized aluminum, vegetable-tanned leather, French Terry cotton). We endeavor to present product colors, dimensions, and weights with the utmost precision. However, natural variances in grain, anodization batches, or display calibration may result in minor superficial differences.
              </p>
              <p style={{ marginTop: '8px' }}>
                All orders are subject to warehouse inventory availability. If an ordered item is discovered to be out of stock post-order, we will immediately inform you and issue a 100% full refund through Razorpay.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>4. Pricing, Currency & Payments</h3>
              <p>
                Prices are stated in <strong>Indian Rupees (₹ INR)</strong>. Prices include standard express delivery charges within India. We reserve the right to modify catalog pricing at any time prior to order placement.
              </p>
              <p style={{ marginTop: '8px' }}>
                Payments must be settled in full prior to dispatch. Payments are processed through the authorized Razorpay checkout gateway supporting UPI, Debit Cards, Credit Cards, and NetBanking. By completing a transaction, you confirm that you are the lawful holder of the payment instrument utilized.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>5. Shipping & Title</h3>
              <p>
                Physical goods are shipped via express third-party couriers to the address provided during checkout. The risk of loss and title for all ordered items passes to you upon delivery by the carrier at the destination address.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>6. 1-Year Limited Hardware Warranty</h3>
              <p>
                Hardware items (such as the Executive Wireless Pitch Presenter clicker, Condenser Microphone, and Laptop Stand) include a <strong>1-Year Limited Replacement Warranty</strong> covering internal electronic or mechanical manufacturing defects.
              </p>
              <p style={{ marginTop: '8px' }}>
                <em>Warranty Exclusions:</em> The warranty explicitly excludes damages resulting from accidents, drops, liquid immersion, unauthorized repairs, normal aesthetic wear-and-tear, or unauthorized tampering.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>7. Intellectual Property</h3>
              <p>
                All brand marks, logos, typography, visual layouts, photography, and product designs on THE BIG PITCH are the exclusive intellectual property of THE BIG PITCH and are protected under Indian copyright, trademark, and design statutes. You may not copy, reverse-engineer, or commercially exploit any content without express written consent.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>8. Limitation of Liability & Force Majeure</h3>
              <p>
                To the fullest extent permissible by law, THE BIG PITCH's maximum aggregate liability arising out of or related to any order shall not exceed the total amount paid by the customer for the specific product in dispute.
              </p>
              <p style={{ marginTop: '8px' }}>
                We shall not be liable for delivery delays or failure in performance arising from events beyond our reasonable control, including acts of God, strikes, natural disasters, courier road blockages, or government restrictions.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>9. Governing Law & Dispute Resolution</h3>
              <p>
                These Terms shall be interpreted and governed in accordance with the substantive laws of India. Any legal dispute, arbitration, or proceeding arising hereunder shall be subject to the exclusive jurisdiction of the competent courts situated in <strong>Mumbai, Maharashtra, India</strong>.
              </p>
            </section>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. DETAILED SHIPPING & DELIVERY POLICY
         ========================================================================= */}
      {currentPolicy === 'shipping' && (
        <div className="glass-card" style={{ padding: '40px 36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Truck size={18} color="#ffffff" />
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.06em', fontWeight: 600 }}>
              Courier Logistics & Timeline Guarantees
            </span>
          </div>

          <h1 style={{ fontSize: '2.2rem', marginBottom: '6px', color: '#ffffff' }}>Shipping & Delivery Policy</h1>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '28px' }}>
            Pan-India Express Air Shipping • Real-Time AWB Tracking
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
            <section>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>1. Pan-India Delivery Coverage</h3>
              <p>
                THE BIG PITCH ships physical hardware, stationery, and apparel across India, servicing over <strong>19,000+ postal PIN codes</strong> in partnership with premier tier-1 air logistics providers including Blue Dart Express, Delhivery, DTDC, and FedEx India.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>2. Dispatch Timeframes</h3>
              <p>
                Every order undergoes hardware diagnostics and packaging inspection before departure:
              </p>
              <ul style={{ paddingLeft: '22px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li><strong>Warehouse Fulfillment:</strong> Orders placed on business days before 2:00 PM IST are processed and packed on the same day. All other orders are dispatched within 24 to 48 business hours.</li>
                <li><strong>Weekends & Public Holidays:</strong> Orders confirmed on Sundays or national holidays are dispatched on the immediate following business day.</li>
              </ul>
            </section>

            <section>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>3. Estimated Transit Schedules</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', margin: '14px 0' }}>
                <div style={{ background: '#121215', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>Metro Hubs</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>2 - 3 Days</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>Mumbai, Bengaluru, Delhi NCR, Hyderabad, Chennai, Pune</div>
                </div>

                <div style={{ background: '#121215', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>Tier-2 & Tier-3 Cities</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>3 - 5 Days</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>State capitals and regional urban centers</div>
                </div>

                <div style={{ background: '#121215', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>Special & Remote Regions</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>5 - 7 Days</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>Northeast, J&K, Andaman & Nicobar islands</div>
                </div>
              </div>
            </section>

            <section>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>4. Free Express Shipping</h3>
              <p>
                We provide <strong>100% Free Shipping</strong> on all physical items. There are zero handling charges, fuel surcharges, or hidden delivery costs added at checkout.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>5. Live Tracking & Delivery Protocol</h3>
              <p>
                Upon package pickup by the carrier, an Air Waybill (AWB) tracking number is generated. You can inspect real-time courier checkpoints anytime from your <strong>My Orders</strong> portal.
              </p>
              <p style={{ marginTop: '8px' }}>
                Couriers will make up to three (3) delivery attempts. An SMS and phone call will be made prior to final delivery. If all attempts fail due to non-availability or an incorrect address, the parcel will return to our warehouse, and reshipment fees may apply.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>6. Tamper-Evident Packaging Verification</h3>
              <p>
                All physical orders are shipped in security-sealed packaging. If you observe that the outer carton is crushed, opened, or resealed with secondary tape, <strong>please refuse delivery</strong> and notify our team immediately at <a href="mailto:support@thebigpitch.com" style={{ color: '#ffffff', textDecoration: 'underline' }}>support@thebigpitch.com</a>.
              </p>
            </section>
          </div>
        </div>
      )}

      {/* =========================================================================
          4. DETAILED CANCELLATION & REFUND POLICY
         ========================================================================= */}
      {currentPolicy === 'refunds' && (
        <div className="glass-card" style={{ padding: '40px 36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <RefreshCcw size={18} color="#ffffff" />
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.06em', fontWeight: 600 }}>
              Consumer Protection (E-Commerce) Rules, 2020 Compliant
            </span>
          </div>

          <h1 style={{ fontSize: '2.2rem', marginBottom: '6px', color: '#ffffff' }}>Cancellation & Refund Policy</h1>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '28px' }}>
            7-Day Replacement Guarantee • Direct Razorpay Gateway Reversals
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
            <section>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>1. Order Cancellation (Pre-Dispatch)</h3>
              <p>
                You may request order cancellation free of penalty at any time <strong>prior to shipment dispatch</strong>. To cancel an order before dispatch:
              </p>
              <ul style={{ paddingLeft: '22px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>Email <a href="mailto:support@thebigpitch.com" style={{ color: '#ffffff', textDecoration: 'underline' }}>support@thebigpitch.com</a> with your Order ID or Razorpay Payment ID.</li>
                <li>Upon verification that the package has not left our warehouse, an immediate 100% cancellation will be executed.</li>
                <li>Your refund will be refunded directly back to your source payment method within 5-7 business days via Razorpay.</li>
              </ul>
              <p style={{ marginTop: '8px' }}>
                <em>Post-Dispatch Rule:</em> Once an order has been picked up by the logistics carrier and an AWB tracking code has been issued, cancellation in transit is not permitted.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>2. 7-Day Replacement Window (Transit Damage or Defect)</h3>
              <p>
                We stand behind our craftsmanship. We provide a <strong>7-Day Replacement Window</strong> from the recorded date of delivery if you receive an item that is:
              </p>
              <ul style={{ paddingLeft: '22px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>Physically broken or damaged during transit.</li>
                <li>Electrically non-operational upon unboxing (DOA - Dead on Arrival).</li>
                <li>Mismatched against the specifications or product title ordered.</li>
              </ul>
            </section>

            <section>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>3. How to Request a Replacement</h3>
              <ol style={{ paddingLeft: '22px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Notify us within seven (7) days of delivery at <a href="mailto:support@thebigpitch.com" style={{ color: '#ffffff', textDecoration: 'underline' }}>support@thebigpitch.com</a>.</li>
                <li>Attach your Order ID and 2-3 clear photographs or a short video demonstrating the functional defect or physical damage.</li>
                <li>Our technical team will review the claim within 24 hours and issue a reverse courier pickup authorization.</li>
                <li>The defective unit must be returned in its original rigid packaging box including all charging cables, protective pouches, and accessories.</li>
                <li>Upon receipt and inspection at our warehouse, a brand-new replacement unit will be dispatched to your address with zero additional cost.</li>
              </ol>
            </section>

            <section>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>4. Refund Policy (When Replacement Is Unavailable)</h3>
              <p>
                If a replacement unit is unavailable in stock, we will issue a full 100% refund. Refunds are credited directly back to the original funding account:
              </p>
              <ul style={{ paddingLeft: '22px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li><strong>UPI Payments:</strong> Credited back to the original VPA/bank account within 24 to 48 hours.</li>
                <li><strong>NetBanking & Debit/Credit Cards:</strong> Credited within 5 to 7 business days depending on your bank's clearing cycle.</li>
              </ul>
            </section>

            <section>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>5. Ineligible Return Conditions</h3>
              <p>Replacements and refunds will not be issued in cases of:</p>
              <ul style={{ paddingLeft: '22px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>Claims initiated after the expiration of the 7-day post-delivery replacement window.</li>
                <li>Physical damage, water damage, or burns caused by user negligence or improper power surges.</li>
                <li>Products returned missing original packaging, cables, or accessories.</li>
              </ul>
            </section>
          </div>
        </div>
      )}

      {/* =========================================================================
          5. DETAILED CONTACT US & GRIEVANCE REDRESSAL
         ========================================================================= */}
      {currentPolicy === 'contact' && (
        <div className="glass-card" style={{ padding: '40px 36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Mail size={18} color="#ffffff" />
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.06em', fontWeight: 600 }}>
              Official Customer Care & Headquarters
            </span>
          </div>

          <h1 style={{ fontSize: '2.2rem', marginBottom: '6px', color: '#ffffff' }}>Contact & Grievance Redressal</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '32px' }}>
            Our dedicated executive desk is available to assist you with order status, logistics tracking, invoice copies, and warranty replacements.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '36px' }}>
            <div style={{ background: '#121215', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <Mail size={22} color="#ffffff" style={{ marginBottom: '10px' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Customer Support Email</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>support@thebigpitch.com</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Average response time: within 4 business hours</div>
            </div>

            <div style={{ background: '#121215', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <Phone size={22} color="#ffffff" style={{ marginBottom: '10px' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Helpline & WhatsApp Desk</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>+91 98200 12345</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Monday through Saturday, 9:30 AM to 6:30 PM IST</div>
            </div>

            <div style={{ background: '#121215', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <MapPin size={22} color="#ffffff" style={{ marginBottom: '10px' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Warehouse & Registered Office</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff', marginTop: '4px' }}>THE BIG PITCH Technologies Pvt. Ltd.</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Unit 402, Trade Centre, Bandra Kurla Complex (BKC), Bandra East, Mumbai, Maharashtra 400051, India
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '8px' }}>
              Statutory Grievance Redressal Mechanism
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              In accordance with Consumer Protection (E-Commerce) Rules, 2020, every customer ticket is acknowledged with a unique tracking ticket within 48 hours and resolved within 15 business days. For escalated matters, write directly to <a href="mailto:grievance@thebigpitch.com" style={{ color: '#ffffff', textDecoration: 'underline' }}>grievance@thebigpitch.com</a> with your Order ID.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
