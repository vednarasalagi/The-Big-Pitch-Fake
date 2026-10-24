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
  CheckCircle2
} from 'lucide-react';

export default function LegalPages({ initialTab = 'privacy', onBackToStore }) {
  const [currentPolicy, setCurrentPolicy] = useState(initialTab); // 'privacy' | 'terms' | 'shipping' | 'refunds' | 'contact'

  return (
    <div className="container" style={{ padding: '40px 24px 80px', maxWidth: '860px' }}>
      {/* Back button */}
      <button 
        className="btn btn-secondary btn-sm"
        onClick={onBackToStore}
        style={{ marginBottom: '24px' }}
      >
        <ArrowLeft size={14} />
        Back to Products
      </button>

      {/* Policy Switcher Bar */}
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
          Cancellation & Refunds
        </button>
        <button
          className={`filter-pill ${currentPolicy === 'contact' ? 'active' : ''}`}
          onClick={() => setCurrentPolicy('contact')}
        >
          Contact Us
        </button>
      </div>

      {/* 1. PRIVACY POLICY */}
      {currentPolicy === 'privacy' && (
        <div className="glass-card" style={{ padding: '36px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Lock size={18} color="#ffffff" />
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.06em', fontWeight: 600 }}>
              Legal Compliance
            </span>
          </div>

          <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: '#ffffff' }}>Privacy Policy</h1>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '24px' }}>
            Last Updated: October 2026 • THE BIG PITCH (Physical Equipment & Founder Goods)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65 }}>
            <section>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '8px' }}>1. Information We Collect</h3>
              <p>
                When you visit <strong>THE BIG PITCH</strong> or place an order for physical goods, we collect personal information necessary to fulfill your orders, provide customer support, and comply with applicable laws. This includes:
              </p>
              <ul style={{ paddingLeft: '20px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li><strong>Identity & Contact Information:</strong> Full name, email address, and mobile phone number for courier delivery notifications and OTP verification.</li>
                <li><strong>Shipping & Delivery Address:</strong> Street address, landmark, city, state, postal PIN code, and country for physical courier dispatch.</li>
                <li><strong>Transaction & Payment Information:</strong> Payment transactions are securely handled directly through <strong>Razorpay Payment Gateway</strong> (Razorpay Software Private Limited). We do not store or process your credit/debit card numbers, CVVs, or UPI MPINs on our servers.</li>
              </ul>
            </section>

            <section>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '8px' }}>2. How We Use Your Information</h3>
              <p>We use your information exclusively for:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>Processing physical product orders and packing shipments.</li>
                <li>Sharing your delivery name, address, and phone number with verified logistics partners (such as Blue Dart, Delhivery, DTDC, FedEx) solely for delivery.</li>
                <li>Communicating real-time tracking numbers and shipment status updates via SMS and email.</li>
                <li>Providing warranty service, replacements, and customer support.</li>
              </ul>
            </section>

            <section>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '8px' }}>3. Data Security & Storage</h3>
              <p>
                Your account data and order history are protected using 256-bit SSL/TLS encryption and stored on Supabase infrastructure with Row Level Security (RLS) policies. Only authorized administrators have access to customer delivery information. We do not sell, rent, or trade your personal information to third-party marketing companies.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '8px' }}>4. Cookies & Analytics</h3>
              <p>
                We use strictly functional cookies and local storage tokens to preserve your login session, shopping preferences, and authentication state.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '8px' }}>5. Contact Our Privacy Officer</h3>
              <p>
                If you have questions about your personal data or wish to request data deletion, contact us at <a href="mailto:privacy@thebigpitch.com" style={{ color: '#ffffff', textDecoration: 'underline' }}>privacy@thebigpitch.com</a>.
              </p>
            </section>
          </div>
        </div>
      )}

      {/* 2. TERMS & CONDITIONS */}
      {currentPolicy === 'terms' && (
        <div className="glass-card" style={{ padding: '36px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <FileText size={18} color="#ffffff" />
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.06em', fontWeight: 600 }}>
              User Agreement
            </span>
          </div>

          <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: '#ffffff' }}>Terms & Conditions</h1>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '24px' }}>
            Last Updated: October 2026 • Governing Law: Jurisdiction of India
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65 }}>
            <section>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '8px' }}>1. Acceptance of Terms</h3>
              <p>
                By accessing, browsing, or purchasing physical equipment from <strong>THE BIG PITCH</strong>, you agree to be bound by these Terms and Conditions and all applicable laws and regulations in India. If you do not agree with any of these terms, you are prohibited from using or purchasing through this website.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '8px' }}>2. Product Information & Pricing</h3>
              <p>
                All prices displayed on THE BIG PITCH are denominated in Indian Rupees (₹ INR) inclusive of applicable taxes unless specified otherwise. We reserve the right to revise product specifications, inventory counts, and prices at any time without prior notice. In the event of a technical typographical error resulting in an incorrect price, we reserve the right to cancel the order and provide a full refund.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '8px' }}>3. Orders & Payment Processing</h3>
              <p>
                Payments on THE BIG PITCH are processed through the authorized Razorpay Payment Gateway. By submitting your payment, you represent and warrant that you are authorized to use the chosen payment method (UPI, Debit/Credit Card, NetBanking). Orders are confirmed upon receipt of successful payment verification from Razorpay.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '8px' }}>4. Physical Delivery & Title</h3>
              <p>
                Risk of loss and title for all physical products purchased from THE BIG PITCH pass to you upon delivery of the items to our third-party carrier. We provide tracking identifiers for all packages to ensure transparency throughout the delivery cycle.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '8px' }}>5. Manufacturer Warranty</h3>
              <p>
                All hardware products (including presenter clickers, microphones, and laptop stands) carry a 1-year limited warranty against manufacturing and electrical defects from the date of delivery. Warranty does not cover accidental damage, physical misuse, water damage, or unauthorized modifications.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '8px' }}>6. Limitation of Liability</h3>
              <p>
                In no event shall THE BIG PITCH, its directors, employees, or partners be liable for any indirect, punitive, incidental, or consequential damages resulting from the use or inability to use the products purchased.
              </p>
            </section>
          </div>
        </div>
      )}

      {/* 3. SHIPPING & DELIVERY POLICY */}
      {currentPolicy === 'shipping' && (
        <div className="glass-card" style={{ padding: '36px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Truck size={18} color="#ffffff" />
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.06em', fontWeight: 600 }}>
              Logistics & Fulfillment
            </span>
          </div>

          <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: '#ffffff' }}>Shipping & Delivery Policy</h1>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '24px' }}>
            Last Updated: October 2026 • Pan-India Courier Dispatches
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65 }}>
            <section>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '8px' }}>1. Order Processing Time</h3>
              <p>
                All in-stock orders are processed, quality-inspected, and packed within <strong>24 to 48 business hours</strong> of payment confirmation via Razorpay. Orders placed on Sundays or national holidays are dispatched on the next business day.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '8px' }}>2. Delivery Timelines</h3>
              <p>We deliver across 19,000+ PIN codes in India. Estimated delivery times are as follows:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li><strong>Metro Cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune):</strong> 2 to 3 business days.</li>
                <li><strong>Tier-2 & Tier-3 Cities:</strong> 3 to 5 business days.</li>
                <li><strong>Remote or Special Service Areas:</strong> 5 to 7 business days.</li>
              </ul>
            </section>

            <section>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '8px' }}>3. Shipping Charges</h3>
              <p>
                We provide <strong>FREE standard express courier delivery</strong> on all orders across India. There are no hidden packaging, handling, or surcharge fees added at checkout.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '8px' }}>4. Courier Partners & Tracking</h3>
              <p>
                Shipments are sent via reputable air couriers including Blue Dart, Delhivery, DTDC, and FedEx India. Once your package is dispatched, you will receive an automated tracking code (AWB) viewable on your <strong>My Orders</strong> page.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '8px' }}>5. Tamper-Proof Packaging</h3>
              <p>
                All orders are packaged in custom heavy-duty matte black rigid boxes with tamper-evident security tape. If the outer carton arrives damaged or tampered with, please do not accept delivery and contact our support immediately.
              </p>
            </section>
          </div>
        </div>
      )}

      {/* 4. CANCELLATION & REFUNDS */}
      {currentPolicy === 'refunds' && (
        <div className="glass-card" style={{ padding: '36px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <RefreshCcw size={18} color="#ffffff" />
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.06em', fontWeight: 600 }}>
              Returns & Claims
            </span>
          </div>

          <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: '#ffffff' }}>Cancellation & Refund Policy</h1>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '24px' }}>
            Last Updated: October 2026 • 7-Day Replacement Guarantee
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65 }}>
            <section>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '8px' }}>1. Order Cancellation</h3>
              <p>
                You may cancel your order at any time <strong>before the product is dispatched</strong> by contacting support or from your account. Once an order has been handed over to the courier partner and an AWB tracking number has been generated, the order cannot be cancelled in transit.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '8px' }}>2. 7-Day Replacement Window</h3>
              <p>
                We offer a <strong>7-Day Replacement Guarantee</strong> for items received in defective, physically damaged, or non-functional condition. To be eligible for a replacement:
              </p>
              <ul style={{ paddingLeft: '20px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>Notify us within 7 days of package delivery at <a href="mailto:support@thebigpitch.com" style={{ color: '#ffffff', textDecoration: 'underline' }}>support@thebigpitch.com</a>.</li>
                <li>Provide your Razorpay Payment ID or Order ID, along with a photograph or short video demonstrating the defect.</li>
                <li>The item must be in its original packaging including cables, cases, and warranty cards.</li>
              </ul>
            </section>

            <section>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '8px' }}>3. Refund Process</h3>
              <p>
                If a replacement unit is unavailable, a full refund will be initiated back to your original payment method (Bank Account, UPI ID, or Card) via Razorpay. Refunds are processed within <strong>5 to 7 business days</strong> as per banking network timelines.
              </p>
            </section>
          </div>
        </div>
      )}

      {/* 5. CONTACT US */}
      {currentPolicy === 'contact' && (
        <div className="glass-card" style={{ padding: '36px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Mail size={18} color="#ffffff" />
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.06em', fontWeight: 600 }}>
              Customer Support
            </span>
          </div>

          <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: '#ffffff' }}>Contact Us</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '28px' }}>
            We're here to assist you with order status, courier delivery inquiries, and warranty claims.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            <div style={{ background: '#121215', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <Mail size={20} color="#ffffff" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Email Support</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff', marginTop: '4px' }}>support@thebigpitch.com</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Response within 24 hours</div>
            </div>

            <div style={{ background: '#121215', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <Phone size={20} color="#ffffff" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Phone / WhatsApp</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff', marginTop: '4px' }}>+91 98200 12345</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Mon - Sat, 10:00 AM - 7:00 PM IST</div>
            </div>

            <div style={{ background: '#121215', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <MapPin size={20} color="#ffffff" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Registered Office</div>
              <div style={{ fontSize: '0.85rem', color: '#ffffff', marginTop: '4px' }}>THE BIG PITCH Store</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Bandra Kurla Complex, Mumbai, Maharashtra 400051</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
