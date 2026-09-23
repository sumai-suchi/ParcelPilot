var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import cookieParser from "cookie-parser";
import cors from "cors";
import express2 from "express";
import httpStatus16 from "http-status";

// src/app/middleware/globalErrorHandler.ts
import httpStatus from "http-status";

// src/generated/prisma/client.ts
import * as path from "node:path";
import { fileURLToPath } from "node:url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.10.0",
  "engineVersion": "0edf323efd1d98336f3f0a68684b56f689b900d3",
  "activeProvider": "postgresql",
  "inlineSchema": 'model Address {\n  id                String     @id @default(uuid()) @db.Uuid\n  customerId        String     @map("customer_id") @db.Uuid\n  label             String?    @db.VarChar(50)\n  addressLine       String     @map("address_line") @db.Text\n  city              String     @db.VarChar(100)\n  area              String     @db.VarChar(100)\n  postalCode        String?    @map("postal_code") @db.VarChar(20)\n  latitude          Decimal?   @db.Decimal(10, 8)\n  longitude         Decimal?   @db.Decimal(11, 8)\n  createdAt         DateTime   @default(now()) @map("created_at") @db.Timestamptz\n  updatedAt         DateTime   @default(now()) @updatedAt @map("updated_at") @db.Timestamptz\n  // Relations\n  customer          Customer   @relation(fields: [customerId], references: [id], onDelete: Cascade, map: "fk_addresses_customer")\n  pickupShipments   Shipment[] @relation("PickupAddressShipments")\n  deliveryShipments Shipment[] @relation("DeliveryAddressShipments")\n\n  @@map("addresses")\n}\n\nmodel Courier {\n  id                 String              @id @default(uuid()) @db.Uuid\n  userId             String              @unique @map("user_id") @db.Uuid\n  hubId              String              @map("hub_id") @db.Uuid\n  vehicleType        String              @map("vehicle_type") @db.VarChar(50)\n  vehicleNumber      String              @map("vehicle_number") @db.VarChar(50)\n  availabilityStatus CourierAvailability @default(AVAILABLE) @map("availability_status")\n  createdAt          DateTime            @default(now()) @map("created_at") @db.Timestamptz\n  updatedAt          DateTime            @default(now()) @updatedAt @map("updated_at") @db.Timestamptz\n  // Relations\n  user               User                @relation(fields: [userId], references: [id], onDelete: Cascade, map: "fk_couriers_user")\n  hub                Hub                 @relation(fields: [hubId], references: [id], onDelete: Restrict, map: "fk_couriers_hub")\n  assignments        CourierParcel[]\n  deliveryAttempts   DeliveryAttempt[]\n\n  @@map("couriers")\n}\n\nmodel CourierParcel {\n  id          String           @id @default(uuid()) @db.Uuid\n  shipmentId  String           @map("shipment_id") @db.Uuid\n  courierId   String           @map("courier_id") @db.Uuid\n  assignedBy  String?          @map("assigned_by") @db.Uuid\n  status      AssignmentStatus @default(PENDING)\n  assignedAt  DateTime         @default(now()) @map("assigned_at") @db.Timestamptz\n  acceptedAt  DateTime?        @map("accepted_at") @db.Timestamptz\n  completedAt DateTime?        @map("completed_at") @db.Timestamptz\n  createdAt   DateTime         @default(now()) @map("created_at") @db.Timestamptz\n  updatedAt   DateTime         @default(now()) @updatedAt @map("updated_at") @db.Timestamptz\n  // Relations\n  shipment    Shipment         @relation(fields: [shipmentId], references: [id], onDelete: Cascade, map: "fk_assignments_shipment")\n  courier     Courier          @relation(fields: [courierId], references: [id], onDelete: Restrict, map: "fk_assignments_courier")\n  assigner    User?            @relation("UserCourierAssignments", fields: [assignedBy], references: [id], onDelete: SetNull, map: "fk_assignments_assigned_by")\n\n  @@index([shipmentId], map: "idx_courier_assignments_shipment")\n  @@index([courierId], map: "idx_courier_assignments_courier")\n  @@map("courier_assignments")\n}\n\nmodel Customer {\n  id        String     @id @default(uuid()) @db.Uuid\n  userId    String     @unique @map("user_id") @db.Uuid\n  createdAt DateTime   @default(now()) @map("created_at") @db.Timestamptz\n  updatedAt DateTime   @default(now()) @updatedAt @map("updated_at") @db.Timestamptz\n  // Relations\n  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade, map: "fk_customers_user")\n  addresses Address[]\n  shipments Shipment[]\n\n  @@map("customers")\n}\n\nmodel DeliveryAttempt {\n  id              String           @id @default(uuid()) @db.Uuid\n  shipmentId      String           @map("shipment_id") @db.Uuid\n  courierId       String           @map("courier_id") @db.Uuid\n  attemptNumber   Int              @default(1) @map("attempt_number")\n  status          AttemptStatus\n  failureReason   String?          @map("failure_reason") @db.VarChar(255)\n  notes           String?          @db.Text\n  attemptedAt     DateTime         @default(now()) @map("attempted_at") @db.Timestamptz\n  createdAt       DateTime         @default(now()) @map("created_at") @db.Timestamptz\n  // Relations\n  shipment        Shipment         @relation(fields: [shipmentId], references: [id], onDelete: Cascade, map: "fk_delivery_attempts_shipment")\n  courier         Courier          @relation(fields: [courierId], references: [id], onDelete: Restrict, map: "fk_delivery_attempts_courier")\n  proofOfDelivery ProofOfDelivery?\n\n  @@index([shipmentId], map: "idx_delivery_attempts_shipment")\n  @@map("delivery_attempts")\n}\n\nenum UserRole {\n  CUSTOMER\n  COURIER\n  HUB_MANAGER\n  OPERATIONS_MANAGER\n  ADMIN\n\n  @@map("user_role")\n}\n\nenum UserStatus {\n  ACTIVE\n  INACTIVE\n  SUSPENDED\n\n  @@map("user_status")\n}\n\nenum CourierAvailability {\n  AVAILABLE\n  BUSY\n  OFFLINE\n\n  @@map("courier_availability")\n}\n\nenum ShipmentStatus {\n  PENDING_APPROVAL\n  CREATED\n  COURIER_ASSIGNED\n  PICKUP_ASSIGNED\n  PICKED_UP\n  AT_ORIGIN_HUB\n  IN_TRANSIT\n  AT_DESTINATION_HUB\n  OUT_FOR_DELIVERY\n  DELIVERED\n  DELIVERY_FAILED\n  RESCHEDULED\n  RETURN_INITIATED\n  RETURN_IN_TRANSIT\n  RETURNED\n  CANCELLED\n\n  @@map("shipment_status")\n}\n\nenum AssignmentStatus {\n  PENDING\n  ACCEPTED\n  REJECTED\n  COMPLETED\n  CANCELLED\n\n  @@map("assignment_status")\n}\n\nenum TransferStatus {\n  PENDING\n  DISPATCHED\n  IN_TRANSIT\n  RECEIVED\n  CANCELLED\n\n  @@map("transfer_status")\n}\n\nenum AttemptStatus {\n  SUCCESS\n  FAILED\n\n  @@map("attempt_status")\n}\n\nenum PaymentStatus {\n  PENDING\n  PAID\n  FAILED\n  REFUNDED\n\n  @@map("payment_status")\n}\n\nenum AuthProvider {\n  GOOGLE\n  CREDENTIALS\n}\n\nmodel Hub {\n  id                   String        @id @default(uuid()) @db.Uuid\n  name                 String        @db.VarChar(150)\n  code                 String        @unique @db.VarChar(50)\n  zoneId               String        @map("zone_id") @db.Uuid\n  address              String        @db.Text\n  phone                String?       @db.VarChar(50)\n  isActive             Boolean       @default(true) @map("is_active")\n  createdAt            DateTime      @default(now()) @map("created_at") @db.Timestamptz\n  updatedAt            DateTime      @default(now()) @updatedAt @map("updated_at") @db.Timestamptz\n  // Relations\n  zone                 Zone          @relation(fields: [zoneId], references: [id], onDelete: Restrict, map: "fk_hubs_zone")\n  couriers             Courier[]\n  originShipments      Shipment[]    @relation("OriginHubShipments")\n  destinationShipments Shipment[]    @relation("DestinationHubShipments")\n  transfersFrom        HubTransfer[] @relation("TransfersFromHub")\n  transfersTo          HubTransfer[] @relation("TransfersToHub")\n\n  @@map("hubs")\n}\n\nmodel HubTransfer {\n  id           String         @id @default(uuid()) @db.Uuid\n  shipmentId   String         @map("shipment_id") @db.Uuid\n  fromHubId    String         @map("from_hub_id") @db.Uuid\n  toHubId      String         @map("to_hub_id") @db.Uuid\n  status       TransferStatus @default(PENDING)\n  dispatchedAt DateTime?      @map("dispatched_at") @db.Timestamptz\n  receivedAt   DateTime?      @map("received_at") @db.Timestamptz\n  createdBy    String?        @map("created_by") @db.Uuid\n  createdAt    DateTime       @default(now()) @map("created_at") @db.Timestamptz\n  updatedAt    DateTime       @default(now()) @updatedAt @map("updated_at") @db.Timestamptz\n  // Relations\n  shipment     Shipment       @relation(fields: [shipmentId], references: [id], onDelete: Cascade, map: "fk_hub_transfers_shipment")\n  fromHub      Hub            @relation("TransfersFromHub", fields: [fromHubId], references: [id], onDelete: Restrict, map: "fk_hub_transfers_from_hub")\n  toHub        Hub            @relation("TransfersToHub", fields: [toHubId], references: [id], onDelete: Restrict, map: "fk_hub_transfers_to_hub")\n  creator      User?          @relation("UserHubTransfers", fields: [createdBy], references: [id], onDelete: SetNull, map: "fk_hub_transfers_created_by")\n\n  @@index([shipmentId], map: "idx_hub_transfers_shipment")\n  @@map("hub_transfers")\n}\n\nmodel Notification {\n  id         String    @id @default(uuid()) @db.Uuid\n  userId     String    @map("user_id") @db.Uuid\n  shipmentId String?   @map("shipment_id") @db.Uuid\n  title      String    @db.VarChar(255)\n  message    String    @db.Text\n  type       String    @db.VarChar(50)\n  isRead     Boolean   @default(false) @map("is_read")\n  createdAt  DateTime  @default(now()) @map("created_at") @db.Timestamptz\n  // Relations\n  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade, map: "fk_notifications_user")\n  shipment   Shipment? @relation(fields: [shipmentId], references: [id], onDelete: SetNull, map: "fk_notifications_shipment")\n\n  @@index([userId], map: "idx_notifications_user")\n  @@map("notifications")\n}\n\nmodel Payment {\n  id            String        @id @default(uuid()) @db.Uuid\n  shipmentId    String        @unique @map("shipment_id") @db.Uuid\n  amount        Decimal       @db.Decimal(10, 2)\n  currency      String        @default("BDT") @db.VarChar(10)\n  provider      String        @db.VarChar(50)\n  transactionId String?       @unique @map("transaction_id") @db.VarChar(255)\n  status        PaymentStatus @default(PENDING)\n  paidAt        DateTime?     @map("paid_at") @db.Timestamptz\n  createdAt     DateTime      @default(now()) @map("created_at") @db.Timestamptz\n  updatedAt     DateTime      @default(now()) @updatedAt @map("updated_at") @db.Timestamptz\n  // Relations\n  shipment      Shipment      @relation(fields: [shipmentId], references: [id], onDelete: Restrict, map: "fk_payments_shipment")\n\n  @@map("payments")\n}\n\nmodel PricingRule {\n  id           String   @id @default(uuid()) @db.Uuid\n  zoneId       String   @map("zone_id") @db.Uuid\n  deliveryType String   @default("STANDARD") @map("delivery_type") @db.VarChar(50)\n  minWeight    Decimal  @default(0.00) @map("min_weight") @db.Decimal(8, 2)\n  maxWeight    Decimal  @map("max_weight") @db.Decimal(8, 2)\n  baseCharge   Decimal  @map("base_charge") @db.Decimal(10, 2)\n  perKgCharge  Decimal  @default(0.00) @map("per_kg_charge") @db.Decimal(10, 2)\n  isActive     Boolean  @default(true) @map("is_active")\n  createdAt    DateTime @default(now()) @map("created_at") @db.Timestamptz\n  updatedAt    DateTime @default(now()) @updatedAt @map("updated_at") @db.Timestamptz\n  // Relations\n  zone         Zone     @relation(fields: [zoneId], references: [id], onDelete: Cascade, map: "fk_pricing_rules_zone")\n\n  @@map("pricing_rules")\n}\n\nmodel ProofOfDelivery {\n  id                String          @id @default(uuid()) @db.Uuid\n  shipmentId        String          @unique @map("shipment_id") @db.Uuid\n  deliveryAttemptId String          @unique @map("delivery_attempt_id") @db.Uuid\n  recipientName     String          @map("recipient_name") @db.VarChar(255)\n  recipientPhone    String          @map("recipient_phone") @db.VarChar(50)\n  imageUrl          String?         @map("image_url") @db.VarChar(1000)\n  signatureUrl      String?         @map("signature_url") @db.VarChar(1000)\n  notes             String?         @db.Text\n  createdAt         DateTime        @default(now()) @map("created_at") @db.Timestamptz\n  // Relations\n  shipment          Shipment        @relation(fields: [shipmentId], references: [id], onDelete: Cascade, map: "fk_pod_shipment")\n  deliveryAttempt   DeliveryAttempt @relation(fields: [deliveryAttemptId], references: [id], onDelete: Cascade, map: "fk_pod_attempt")\n\n  @@map("proof_of_deliveries")\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Shipment {\n  id                 String                  @id @default(uuid()) @db.Uuid\n  trackingNumber     String                  @unique @map("tracking_number") @db.VarChar(50)\n  customerId         String                  @map("customer_id") @db.Uuid\n  pickupAddressId    String                  @map("pickup_address_id") @db.Uuid\n  deliveryAddressId  String                  @map("delivery_address_id") @db.Uuid\n  originHubId        String?                 @map("origin_hub_id") @db.Uuid\n  destinationHubId   String?                 @map("destination_hub_id") @db.Uuid\n  parcelType         String                  @map("parcel_type") @db.VarChar(50)\n  weight             Decimal                 @db.Decimal(8, 2)\n  description        String?                 @db.Text\n  deliveryType       String                  @default("STANDARD") @map("delivery_type") @db.VarChar(50)\n  status             ShipmentStatus          @default(PENDING_APPROVAL)\n  deliveryCharge     Decimal                 @default(0.00) @map("delivery_charge") @db.Decimal(10, 2)\n  paymentStatus      PaymentStatus           @default(PENDING) @map("payment_status")\n  scheduledPickupAt  DateTime?               @map("scheduled_pickup_at") @db.Timestamptz\n  createdAt          DateTime                @default(now()) @map("created_at") @db.Timestamptz\n  updatedAt          DateTime                @default(now()) @updatedAt @map("updated_at") @db.Timestamptz\n  // Relations\n  customer           Customer                @relation(fields: [customerId], references: [id], onDelete: Restrict, map: "fk_shipments_customer")\n  pickupAddress      Address                 @relation("PickupAddressShipments", fields: [pickupAddressId], references: [id], onDelete: Restrict, map: "fk_shipments_pickup_address")\n  deliveryAddress    Address                 @relation("DeliveryAddressShipments", fields: [deliveryAddressId], references: [id], onDelete: Restrict, map: "fk_shipments_delivery_address")\n  originHub          Hub?                    @relation("OriginHubShipments", fields: [originHubId], references: [id], onDelete: Restrict, map: "fk_shipments_origin_hub")\n  destinationHub     Hub?                    @relation("DestinationHubShipments", fields: [destinationHubId], references: [id], onDelete: Restrict, map: "fk_shipments_dest_hub")\n  // Downstream Operations Relations\n  statusHistory      ShipmentStatusHistory[]\n  courierAssignments CourierParcel[]\n  hubTransfers       HubTransfer[]\n  deliveryAttempts   DeliveryAttempt[]\n  proofOfDelivery    ProofOfDelivery?\n  payment            Payment?\n  notifications      Notification[]\n\n  @@index([trackingNumber], map: "idx_shipments_tracking_number")\n  @@index([status], map: "idx_shipments_status")\n  @@index([customerId], map: "idx_shipments_customer")\n  @@map("shipments")\n}\n\nmodel ShipmentStatusHistory {\n  id         String         @id @default(uuid()) @db.Uuid\n  shipmentId String         @map("shipment_id") @db.Uuid\n  status     ShipmentStatus\n  location   String?        @db.VarChar(255)\n  note       String?        @db.Text\n  updatedBy  String?        @map("updated_by") @db.Uuid\n  createdAt  DateTime       @default(now()) @map("created_at") @db.Timestamptz\n  // Relations\n  shipment   Shipment       @relation(fields: [shipmentId], references: [id], onDelete: Cascade, map: "fk_status_history_shipment")\n  updater    User?          @relation("UserStatusUpdates", fields: [updatedBy], references: [id], onDelete: SetNull, map: "fk_status_history_user")\n\n  @@index([shipmentId], map: "idx_shipment_history_shipment")\n  @@map("shipment_status_history")\n}\n\nmodel User {\n  id               String                  @id @default(uuid()) @db.Uuid\n  name             String                  @db.VarChar(255)\n  email            String                  @unique @db.VarChar(255)\n  password         String?                 @db.VarChar(255)\n  googleId         String?                 @unique @map("google_id")\n  authProvider     AuthProvider            @default(CREDENTIALS)\n  emailVerified    Boolean?                @default(false) @map("email_verified")\n  phone            String?                 @unique @db.VarChar(50)\n  role             UserRole                @default(CUSTOMER)\n  status           UserStatus              @default(ACTIVE)\n  createdAt        DateTime                @default(now()) @map("created_at") @db.Timestamptz\n  updatedAt        DateTime                @default(now()) @updatedAt @map("updated_at") @db.Timestamptz\n  // Relations (1:1 with Profiles)\n  customer         Customer?\n  courier          Courier?\n  // Operational Relations\n  statusUpdates    ShipmentStatusHistory[] @relation("UserStatusUpdates")\n  assignedCouriers CourierParcel[]         @relation("UserCourierAssignments")\n  createdTransfers HubTransfer[]           @relation("UserHubTransfers")\n  notifications    Notification[]\n\n  @@map("users")\n}\n\nmodel Zone {\n  id           String        @id @default(uuid()) @db.Uuid\n  name         String        @db.VarChar(100)\n  code         String        @unique @db.VarChar(50)\n  isActive     Boolean       @default(true) @map("is_active")\n  createdAt    DateTime      @default(now()) @map("created_at") @db.Timestamptz\n  updatedAt    DateTime      @default(now()) @updatedAt @map("updated_at") @db.Timestamptz\n  // Relations\n  hubs         Hub[]\n  pricingRules PricingRule[]\n\n  @@map("zones")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Address":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String","dbName":"customer_id"},{"name":"label","kind":"scalar","type":"String"},{"name":"addressLine","kind":"scalar","type":"String","dbName":"address_line"},{"name":"city","kind":"scalar","type":"String"},{"name":"area","kind":"scalar","type":"String"},{"name":"postalCode","kind":"scalar","type":"String","dbName":"postal_code"},{"name":"latitude","kind":"scalar","type":"Decimal"},{"name":"longitude","kind":"scalar","type":"Decimal"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"customer","kind":"object","type":"Customer","relationName":"AddressToCustomer"},{"name":"pickupShipments","kind":"object","type":"Shipment","relationName":"PickupAddressShipments"},{"name":"deliveryShipments","kind":"object","type":"Shipment","relationName":"DeliveryAddressShipments"}],"dbName":"addresses","schema":null},"Courier":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String","dbName":"user_id"},{"name":"hubId","kind":"scalar","type":"String","dbName":"hub_id"},{"name":"vehicleType","kind":"scalar","type":"String","dbName":"vehicle_type"},{"name":"vehicleNumber","kind":"scalar","type":"String","dbName":"vehicle_number"},{"name":"availabilityStatus","kind":"enum","type":"CourierAvailability","dbName":"availability_status"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"user","kind":"object","type":"User","relationName":"CourierToUser"},{"name":"hub","kind":"object","type":"Hub","relationName":"CourierToHub"},{"name":"assignments","kind":"object","type":"CourierParcel","relationName":"CourierToCourierParcel"},{"name":"deliveryAttempts","kind":"object","type":"DeliveryAttempt","relationName":"CourierToDeliveryAttempt"}],"dbName":"couriers","schema":null},"CourierParcel":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"shipmentId","kind":"scalar","type":"String","dbName":"shipment_id"},{"name":"courierId","kind":"scalar","type":"String","dbName":"courier_id"},{"name":"assignedBy","kind":"scalar","type":"String","dbName":"assigned_by"},{"name":"status","kind":"enum","type":"AssignmentStatus"},{"name":"assignedAt","kind":"scalar","type":"DateTime","dbName":"assigned_at"},{"name":"acceptedAt","kind":"scalar","type":"DateTime","dbName":"accepted_at"},{"name":"completedAt","kind":"scalar","type":"DateTime","dbName":"completed_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"shipment","kind":"object","type":"Shipment","relationName":"CourierParcelToShipment"},{"name":"courier","kind":"object","type":"Courier","relationName":"CourierToCourierParcel"},{"name":"assigner","kind":"object","type":"User","relationName":"UserCourierAssignments"}],"dbName":"courier_assignments","schema":null},"Customer":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String","dbName":"user_id"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"user","kind":"object","type":"User","relationName":"CustomerToUser"},{"name":"addresses","kind":"object","type":"Address","relationName":"AddressToCustomer"},{"name":"shipments","kind":"object","type":"Shipment","relationName":"CustomerToShipment"}],"dbName":"customers","schema":null},"DeliveryAttempt":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"shipmentId","kind":"scalar","type":"String","dbName":"shipment_id"},{"name":"courierId","kind":"scalar","type":"String","dbName":"courier_id"},{"name":"attemptNumber","kind":"scalar","type":"Int","dbName":"attempt_number"},{"name":"status","kind":"enum","type":"AttemptStatus"},{"name":"failureReason","kind":"scalar","type":"String","dbName":"failure_reason"},{"name":"notes","kind":"scalar","type":"String"},{"name":"attemptedAt","kind":"scalar","type":"DateTime","dbName":"attempted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"shipment","kind":"object","type":"Shipment","relationName":"DeliveryAttemptToShipment"},{"name":"courier","kind":"object","type":"Courier","relationName":"CourierToDeliveryAttempt"},{"name":"proofOfDelivery","kind":"object","type":"ProofOfDelivery","relationName":"DeliveryAttemptToProofOfDelivery"}],"dbName":"delivery_attempts","schema":null},"Hub":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"code","kind":"scalar","type":"String"},{"name":"zoneId","kind":"scalar","type":"String","dbName":"zone_id"},{"name":"address","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean","dbName":"is_active"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"zone","kind":"object","type":"Zone","relationName":"HubToZone"},{"name":"couriers","kind":"object","type":"Courier","relationName":"CourierToHub"},{"name":"originShipments","kind":"object","type":"Shipment","relationName":"OriginHubShipments"},{"name":"destinationShipments","kind":"object","type":"Shipment","relationName":"DestinationHubShipments"},{"name":"transfersFrom","kind":"object","type":"HubTransfer","relationName":"TransfersFromHub"},{"name":"transfersTo","kind":"object","type":"HubTransfer","relationName":"TransfersToHub"}],"dbName":"hubs","schema":null},"HubTransfer":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"shipmentId","kind":"scalar","type":"String","dbName":"shipment_id"},{"name":"fromHubId","kind":"scalar","type":"String","dbName":"from_hub_id"},{"name":"toHubId","kind":"scalar","type":"String","dbName":"to_hub_id"},{"name":"status","kind":"enum","type":"TransferStatus"},{"name":"dispatchedAt","kind":"scalar","type":"DateTime","dbName":"dispatched_at"},{"name":"receivedAt","kind":"scalar","type":"DateTime","dbName":"received_at"},{"name":"createdBy","kind":"scalar","type":"String","dbName":"created_by"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"shipment","kind":"object","type":"Shipment","relationName":"HubTransferToShipment"},{"name":"fromHub","kind":"object","type":"Hub","relationName":"TransfersFromHub"},{"name":"toHub","kind":"object","type":"Hub","relationName":"TransfersToHub"},{"name":"creator","kind":"object","type":"User","relationName":"UserHubTransfers"}],"dbName":"hub_transfers","schema":null},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String","dbName":"user_id"},{"name":"shipmentId","kind":"scalar","type":"String","dbName":"shipment_id"},{"name":"title","kind":"scalar","type":"String"},{"name":"message","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"isRead","kind":"scalar","type":"Boolean","dbName":"is_read"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"},{"name":"shipment","kind":"object","type":"Shipment","relationName":"NotificationToShipment"}],"dbName":"notifications","schema":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"shipmentId","kind":"scalar","type":"String","dbName":"shipment_id"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"provider","kind":"scalar","type":"String"},{"name":"transactionId","kind":"scalar","type":"String","dbName":"transaction_id"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"paidAt","kind":"scalar","type":"DateTime","dbName":"paid_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"shipment","kind":"object","type":"Shipment","relationName":"PaymentToShipment"}],"dbName":"payments","schema":null},"PricingRule":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"zoneId","kind":"scalar","type":"String","dbName":"zone_id"},{"name":"deliveryType","kind":"scalar","type":"String","dbName":"delivery_type"},{"name":"minWeight","kind":"scalar","type":"Decimal","dbName":"min_weight"},{"name":"maxWeight","kind":"scalar","type":"Decimal","dbName":"max_weight"},{"name":"baseCharge","kind":"scalar","type":"Decimal","dbName":"base_charge"},{"name":"perKgCharge","kind":"scalar","type":"Decimal","dbName":"per_kg_charge"},{"name":"isActive","kind":"scalar","type":"Boolean","dbName":"is_active"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"zone","kind":"object","type":"Zone","relationName":"PricingRuleToZone"}],"dbName":"pricing_rules","schema":null},"ProofOfDelivery":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"shipmentId","kind":"scalar","type":"String","dbName":"shipment_id"},{"name":"deliveryAttemptId","kind":"scalar","type":"String","dbName":"delivery_attempt_id"},{"name":"recipientName","kind":"scalar","type":"String","dbName":"recipient_name"},{"name":"recipientPhone","kind":"scalar","type":"String","dbName":"recipient_phone"},{"name":"imageUrl","kind":"scalar","type":"String","dbName":"image_url"},{"name":"signatureUrl","kind":"scalar","type":"String","dbName":"signature_url"},{"name":"notes","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"shipment","kind":"object","type":"Shipment","relationName":"ProofOfDeliveryToShipment"},{"name":"deliveryAttempt","kind":"object","type":"DeliveryAttempt","relationName":"DeliveryAttemptToProofOfDelivery"}],"dbName":"proof_of_deliveries","schema":null},"Shipment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"trackingNumber","kind":"scalar","type":"String","dbName":"tracking_number"},{"name":"customerId","kind":"scalar","type":"String","dbName":"customer_id"},{"name":"pickupAddressId","kind":"scalar","type":"String","dbName":"pickup_address_id"},{"name":"deliveryAddressId","kind":"scalar","type":"String","dbName":"delivery_address_id"},{"name":"originHubId","kind":"scalar","type":"String","dbName":"origin_hub_id"},{"name":"destinationHubId","kind":"scalar","type":"String","dbName":"destination_hub_id"},{"name":"parcelType","kind":"scalar","type":"String","dbName":"parcel_type"},{"name":"weight","kind":"scalar","type":"Decimal"},{"name":"description","kind":"scalar","type":"String"},{"name":"deliveryType","kind":"scalar","type":"String","dbName":"delivery_type"},{"name":"status","kind":"enum","type":"ShipmentStatus"},{"name":"deliveryCharge","kind":"scalar","type":"Decimal","dbName":"delivery_charge"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus","dbName":"payment_status"},{"name":"scheduledPickupAt","kind":"scalar","type":"DateTime","dbName":"scheduled_pickup_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"customer","kind":"object","type":"Customer","relationName":"CustomerToShipment"},{"name":"pickupAddress","kind":"object","type":"Address","relationName":"PickupAddressShipments"},{"name":"deliveryAddress","kind":"object","type":"Address","relationName":"DeliveryAddressShipments"},{"name":"originHub","kind":"object","type":"Hub","relationName":"OriginHubShipments"},{"name":"destinationHub","kind":"object","type":"Hub","relationName":"DestinationHubShipments"},{"name":"statusHistory","kind":"object","type":"ShipmentStatusHistory","relationName":"ShipmentToShipmentStatusHistory"},{"name":"courierAssignments","kind":"object","type":"CourierParcel","relationName":"CourierParcelToShipment"},{"name":"hubTransfers","kind":"object","type":"HubTransfer","relationName":"HubTransferToShipment"},{"name":"deliveryAttempts","kind":"object","type":"DeliveryAttempt","relationName":"DeliveryAttemptToShipment"},{"name":"proofOfDelivery","kind":"object","type":"ProofOfDelivery","relationName":"ProofOfDeliveryToShipment"},{"name":"payment","kind":"object","type":"Payment","relationName":"PaymentToShipment"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToShipment"}],"dbName":"shipments","schema":null},"ShipmentStatusHistory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"shipmentId","kind":"scalar","type":"String","dbName":"shipment_id"},{"name":"status","kind":"enum","type":"ShipmentStatus"},{"name":"location","kind":"scalar","type":"String"},{"name":"note","kind":"scalar","type":"String"},{"name":"updatedBy","kind":"scalar","type":"String","dbName":"updated_by"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"shipment","kind":"object","type":"Shipment","relationName":"ShipmentToShipmentStatusHistory"},{"name":"updater","kind":"object","type":"User","relationName":"UserStatusUpdates"}],"dbName":"shipment_status_history","schema":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"googleId","kind":"scalar","type":"String","dbName":"google_id"},{"name":"authProvider","kind":"enum","type":"AuthProvider"},{"name":"emailVerified","kind":"scalar","type":"Boolean","dbName":"email_verified"},{"name":"phone","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"customer","kind":"object","type":"Customer","relationName":"CustomerToUser"},{"name":"courier","kind":"object","type":"Courier","relationName":"CourierToUser"},{"name":"statusUpdates","kind":"object","type":"ShipmentStatusHistory","relationName":"UserStatusUpdates"},{"name":"assignedCouriers","kind":"object","type":"CourierParcel","relationName":"UserCourierAssignments"},{"name":"createdTransfers","kind":"object","type":"HubTransfer","relationName":"UserHubTransfers"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"}],"dbName":"users","schema":null},"Zone":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"code","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean","dbName":"is_active"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"hubs","kind":"object","type":"Hub","relationName":"HubToZone"},{"name":"pricingRules","kind":"object","type":"PricingRule","relationName":"PricingRuleToZone"}],"dbName":"zones","schema":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","customer","user","orderBy","cursor","hubs","zone","pricingRules","_count","couriers","pickupAddress","deliveryAddress","originHub","destinationHub","shipment","updater","statusHistory","courier","assigner","courierAssignments","fromHub","toHub","creator","hubTransfers","deliveryAttempt","proofOfDelivery","deliveryAttempts","payment","notifications","originShipments","destinationShipments","transfersFrom","transfersTo","hub","assignments","statusUpdates","assignedCouriers","createdTransfers","addresses","shipments","pickupShipments","deliveryShipments","Address.findUnique","Address.findUniqueOrThrow","Address.findFirst","Address.findFirstOrThrow","Address.findMany","data","Address.createOne","Address.createMany","Address.createManyAndReturn","Address.updateOne","Address.updateMany","Address.updateManyAndReturn","create","update","Address.upsertOne","Address.deleteOne","Address.deleteMany","having","_avg","_sum","_min","_max","Address.groupBy","Address.aggregate","Courier.findUnique","Courier.findUniqueOrThrow","Courier.findFirst","Courier.findFirstOrThrow","Courier.findMany","Courier.createOne","Courier.createMany","Courier.createManyAndReturn","Courier.updateOne","Courier.updateMany","Courier.updateManyAndReturn","Courier.upsertOne","Courier.deleteOne","Courier.deleteMany","Courier.groupBy","Courier.aggregate","CourierParcel.findUnique","CourierParcel.findUniqueOrThrow","CourierParcel.findFirst","CourierParcel.findFirstOrThrow","CourierParcel.findMany","CourierParcel.createOne","CourierParcel.createMany","CourierParcel.createManyAndReturn","CourierParcel.updateOne","CourierParcel.updateMany","CourierParcel.updateManyAndReturn","CourierParcel.upsertOne","CourierParcel.deleteOne","CourierParcel.deleteMany","CourierParcel.groupBy","CourierParcel.aggregate","Customer.findUnique","Customer.findUniqueOrThrow","Customer.findFirst","Customer.findFirstOrThrow","Customer.findMany","Customer.createOne","Customer.createMany","Customer.createManyAndReturn","Customer.updateOne","Customer.updateMany","Customer.updateManyAndReturn","Customer.upsertOne","Customer.deleteOne","Customer.deleteMany","Customer.groupBy","Customer.aggregate","DeliveryAttempt.findUnique","DeliveryAttempt.findUniqueOrThrow","DeliveryAttempt.findFirst","DeliveryAttempt.findFirstOrThrow","DeliveryAttempt.findMany","DeliveryAttempt.createOne","DeliveryAttempt.createMany","DeliveryAttempt.createManyAndReturn","DeliveryAttempt.updateOne","DeliveryAttempt.updateMany","DeliveryAttempt.updateManyAndReturn","DeliveryAttempt.upsertOne","DeliveryAttempt.deleteOne","DeliveryAttempt.deleteMany","DeliveryAttempt.groupBy","DeliveryAttempt.aggregate","Hub.findUnique","Hub.findUniqueOrThrow","Hub.findFirst","Hub.findFirstOrThrow","Hub.findMany","Hub.createOne","Hub.createMany","Hub.createManyAndReturn","Hub.updateOne","Hub.updateMany","Hub.updateManyAndReturn","Hub.upsertOne","Hub.deleteOne","Hub.deleteMany","Hub.groupBy","Hub.aggregate","HubTransfer.findUnique","HubTransfer.findUniqueOrThrow","HubTransfer.findFirst","HubTransfer.findFirstOrThrow","HubTransfer.findMany","HubTransfer.createOne","HubTransfer.createMany","HubTransfer.createManyAndReturn","HubTransfer.updateOne","HubTransfer.updateMany","HubTransfer.updateManyAndReturn","HubTransfer.upsertOne","HubTransfer.deleteOne","HubTransfer.deleteMany","HubTransfer.groupBy","HubTransfer.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","PricingRule.findUnique","PricingRule.findUniqueOrThrow","PricingRule.findFirst","PricingRule.findFirstOrThrow","PricingRule.findMany","PricingRule.createOne","PricingRule.createMany","PricingRule.createManyAndReturn","PricingRule.updateOne","PricingRule.updateMany","PricingRule.updateManyAndReturn","PricingRule.upsertOne","PricingRule.deleteOne","PricingRule.deleteMany","PricingRule.groupBy","PricingRule.aggregate","ProofOfDelivery.findUnique","ProofOfDelivery.findUniqueOrThrow","ProofOfDelivery.findFirst","ProofOfDelivery.findFirstOrThrow","ProofOfDelivery.findMany","ProofOfDelivery.createOne","ProofOfDelivery.createMany","ProofOfDelivery.createManyAndReturn","ProofOfDelivery.updateOne","ProofOfDelivery.updateMany","ProofOfDelivery.updateManyAndReturn","ProofOfDelivery.upsertOne","ProofOfDelivery.deleteOne","ProofOfDelivery.deleteMany","ProofOfDelivery.groupBy","ProofOfDelivery.aggregate","Shipment.findUnique","Shipment.findUniqueOrThrow","Shipment.findFirst","Shipment.findFirstOrThrow","Shipment.findMany","Shipment.createOne","Shipment.createMany","Shipment.createManyAndReturn","Shipment.updateOne","Shipment.updateMany","Shipment.updateManyAndReturn","Shipment.upsertOne","Shipment.deleteOne","Shipment.deleteMany","Shipment.groupBy","Shipment.aggregate","ShipmentStatusHistory.findUnique","ShipmentStatusHistory.findUniqueOrThrow","ShipmentStatusHistory.findFirst","ShipmentStatusHistory.findFirstOrThrow","ShipmentStatusHistory.findMany","ShipmentStatusHistory.createOne","ShipmentStatusHistory.createMany","ShipmentStatusHistory.createManyAndReturn","ShipmentStatusHistory.updateOne","ShipmentStatusHistory.updateMany","ShipmentStatusHistory.updateManyAndReturn","ShipmentStatusHistory.upsertOne","ShipmentStatusHistory.deleteOne","ShipmentStatusHistory.deleteMany","ShipmentStatusHistory.groupBy","ShipmentStatusHistory.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Zone.findUnique","Zone.findUniqueOrThrow","Zone.findFirst","Zone.findFirstOrThrow","Zone.findMany","Zone.createOne","Zone.createMany","Zone.createManyAndReturn","Zone.updateOne","Zone.updateMany","Zone.updateManyAndReturn","Zone.upsertOne","Zone.deleteOne","Zone.deleteMany","Zone.groupBy","Zone.aggregate","AND","OR","NOT","id","name","code","isActive","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","every","some","none","email","password","googleId","AuthProvider","authProvider","emailVerified","phone","UserRole","role","UserStatus","status","shipmentId","ShipmentStatus","location","note","updatedBy","trackingNumber","customerId","pickupAddressId","deliveryAddressId","originHubId","destinationHubId","parcelType","weight","description","deliveryType","deliveryCharge","PaymentStatus","paymentStatus","scheduledPickupAt","deliveryAttemptId","recipientName","recipientPhone","imageUrl","signatureUrl","notes","zoneId","minWeight","maxWeight","baseCharge","perKgCharge","amount","currency","provider","transactionId","paidAt","userId","title","message","type","isRead","fromHubId","toHubId","TransferStatus","dispatchedAt","receivedAt","createdBy","address","courierId","attemptNumber","AttemptStatus","failureReason","attemptedAt","assignedBy","AssignmentStatus","assignedAt","acceptedAt","completedAt","hubId","vehicleType","vehicleNumber","CourierAvailability","availabilityStatus","label","addressLine","city","area","postalCode","latitude","longitude","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "pwmKAfABEQEAAKcEACAoAACYBAAgKQAAmAQAIKICAAClBAAwowIAAFEAEKQCAAClBAAwpQIBAAAAAakCQADMAwAhqgJAAMwDACHKAgEAyQMAIYIDAQDiAwAhgwMBAMoDACGEAwEAygMAIYUDAQDKAwAhhgMBAOIDACGHAxAApgQAIYgDEACmBAAhAQAAAAEAIAoCAACWBAAgJgAAlwQAICcAAJgEACCiAgAAlQQAMKMCAAADABCkAgAAlQQAMKUCAQDJAwAhqQJAAMwDACGqAkAAzAMAIecCAQDJAwAhAQAAAAMAIA8CAACWBAAgGgAAvAQAICEAALMEACAiAADqAwAgogIAAL4EADCjAgAABQAQpAIAAL4EADClAgEAyQMAIakCQADMAwAhqgJAAMwDACHnAgEAyQMAIf0CAQDJAwAh_gIBAMoDACH_AgEAygMAIYEDAAC_BIEDIgEAAAAFACASBgAAwQQAIAkAAMMEACAdAACYBAAgHgAAmAQAIB8AAOsDACAgAADrAwAgogIAAMIEADCjAgAABwAQpAIAAMIEADClAgEAyQMAIaYCAQDKAwAhpwIBAMoDACGoAiAAywMAIakCQADMAwAhqgJAAMwDACG_AgEA4gMAId0CAQDJAwAh8gIBAMoDACEHBgAAiQgAIAkAAIoIACAdAAD2BwAgHgAA9gcAIB8AAMIHACAgAADCBwAgvwIAAMYGACASBgAAwQQAIAkAAMMEACAdAACYBAAgHgAAmAQAIB8AAOsDACAgAADrAwAgogIAAMIEADCjAgAABwAQpAIAAMIEADClAgEAAAABpgIBAMoDACGnAgEAAAABqAIgAMsDACGpAkAAzAMAIaoCQADMAwAhvwIBAOIDACHdAgEAyQMAIfICAQDKAwAhAwAAAAcAIAMAAAgAMAQAAAkAIA4GAADBBAAgogIAAMAEADCjAgAACwAQpAIAAMAEADClAgEAyQMAIagCIADLAwAhqQJAAMwDACGqAkAAzAMAIdICAQDKAwAh3QIBAMkDACHeAhAAhAQAId8CEACEBAAh4AIQAIQEACHhAhAAhAQAIQEGAACJCAAgDgYAAMEEACCiAgAAwAQAMKMCAAALABCkAgAAwAQAMKUCAQAAAAGoAiAAywMAIakCQADMAwAhqgJAAMwDACHSAgEAygMAId0CAQDJAwAh3gIQAIQEACHfAhAAhAQAIeACEACEBAAh4QIQAIQEACEDAAAACwAgAwAADAAwBAAADQAgAQAAAAcAIAEAAAALACAEAgAA9AcAIBoAAIcIACAhAACFCAAgIgAAwQcAIA8CAACWBAAgGgAAvAQAICEAALMEACAiAADqAwAgogIAAL4EADCjAgAABQAQpAIAAL4EADClAgEAAAABqQJAAMwDACGqAkAAzAMAIecCAQAAAAH9AgEAyQMAIf4CAQDKAwAh_wIBAMoDACGBAwAAvwSBAyIDAAAABQAgAwAAEQAwBAAAEgAgIAEAAKcEACAKAAC6BAAgCwAAugQAIAwAALsEACANAAC7BAAgEAAA6QMAIBMAAOoDACAXAADrAwAgGQAAsAQAIBoAALwEACAbAAC9BAAgHAAA7AMAIKICAAC5BAAwowIAABQAEKQCAAC5BAAwpQIBAMkDACGpAkAAzAMAIaoCQADMAwAhwwIAALgExgIiyQIBAMoDACHKAgEAyQMAIcsCAQDJAwAhzAIBAMkDACHNAgEAqQQAIc4CAQCpBAAhzwIBAMoDACHQAhAAhAQAIdECAQDiAwAh0gIBAMoDACHTAhAAhAQAIdUCAACFBNUCItYCQACGBAAhEAEAAL4HACAKAACGCAAgCwAAhggAIAwAAIUIACANAACFCAAgEAAAwAcAIBMAAMEHACAXAADCBwAgGQAAhAgAIBoAAIcIACAbAACICAAgHAAAwwcAIM0CAADGBgAgzgIAAMYGACDRAgAAxgYAINYCAADGBgAgIAEAAKcEACAKAAC6BAAgCwAAugQAIAwAALsEACANAAC7BAAgEAAA6QMAIBMAAOoDACAXAADrAwAgGQAAsAQAIBoAALwEACAbAAC9BAAgHAAA7AMAIKICAAC5BAAwowIAABQAEKQCAAC5BAAwpQIBAAAAAakCQADMAwAhqgJAAMwDACHDAgAAuATGAiLJAgEAAAABygIBAMkDACHLAgEAyQMAIcwCAQDJAwAhzQIBAKkEACHOAgEAqQQAIc8CAQDKAwAh0AIQAIQEACHRAgEA4gMAIdICAQDKAwAh0wIQAIQEACHVAgAAhQTVAiLWAkAAhgQAIQMAAAAUACADAAAVADAEAAAWACABAAAABwAgAQAAAAcAIAwOAAD_AwAgDwAAtAQAIKICAAC3BAAwowIAABoAEKQCAAC3BAAwpQIBAMkDACGpAkAAzAMAIcMCAAC4BMYCIsQCAQDJAwAhxgIBAOIDACHHAgEA4gMAIcgCAQCpBAAhBQ4AAM8HACAPAAD0BwAgxgIAAMYGACDHAgAAxgYAIMgCAADGBgAgDA4AAP8DACAPAAC0BAAgogIAALcEADCjAgAAGgAQpAIAALcEADClAgEAAAABqQJAAMwDACHDAgAAuATGAiLEAgEAyQMAIcYCAQDiAwAhxwIBAOIDACHIAgEAqQQAIQMAAAAaACADAAAbADAEAAAcACAVAQAA5wMAIBEAAOgDACAcAADsAwAgIwAA6QMAICQAAOoDACAlAADrAwAgogIAAOEDADCjAgAAHgAQpAIAAOEDADClAgEAyQMAIaYCAQDKAwAhqQJAAMwDACGqAkAAzAMAIbkCAQDKAwAhugIBAOIDACG7AgEA4gMAIb0CAADjA70CIr4CIADkAwAhvwIBAOIDACHBAgAA5QPBAiLDAgAA5gPDAiIBAAAAHgAgEA4AAP8DACARAACvBAAgEgAAtAQAIKICAAC1BAAwowIAACAAEKQCAAC1BAAwpQIBAMkDACGpAkAAzAMAIaoCQADMAwAhwwIAALYE-gIixAIBAMkDACHzAgEAyQMAIfgCAQCpBAAh-gJAAMwDACH7AkAAhgQAIfwCQACGBAAhBg4AAM8HACARAAC_BwAgEgAA9AcAIPgCAADGBgAg-wIAAMYGACD8AgAAxgYAIBAOAAD_AwAgEQAArwQAIBIAALQEACCiAgAAtQQAMKMCAAAgABCkAgAAtQQAMKUCAQAAAAGpAkAAzAMAIaoCQADMAwAhwwIAALYE-gIixAIBAMkDACHzAgEAyQMAIfgCAQCpBAAh-gJAAMwDACH7AkAAhgQAIfwCQACGBAAhAwAAACAAIAMAACEAMAQAACIAIAEAAAAeACARDgAA_wMAIBQAALMEACAVAACzBAAgFgAAtAQAIKICAACxBAAwowIAACUAEKQCAACxBAAwpQIBAMkDACGpAkAAzAMAIaoCQADMAwAhwwIAALIE7wIixAIBAMkDACHsAgEAyQMAIe0CAQDJAwAh7wJAAIYEACHwAkAAhgQAIfECAQCpBAAhBw4AAM8HACAUAACFCAAgFQAAhQgAIBYAAPQHACDvAgAAxgYAIPACAADGBgAg8QIAAMYGACARDgAA_wMAIBQAALMEACAVAACzBAAgFgAAtAQAIKICAACxBAAwowIAACUAEKQCAACxBAAwpQIBAAAAAakCQADMAwAhqgJAAMwDACHDAgAAsgTvAiLEAgEAyQMAIewCAQDJAwAh7QIBAMkDACHvAkAAhgQAIfACQACGBAAh8QIBAKkEACEDAAAAJQAgAwAAJgAwBAAAJwAgAQAAAB4AIA8OAAD_AwAgEQAArwQAIBkAALAEACCiAgAArAQAMKMCAAAqABCkAgAArAQAMKUCAQDJAwAhqQJAAMwDACHDAgAArgT2AiLEAgEAyQMAIdwCAQDiAwAh8wIBAMkDACH0AgIArQQAIfYCAQDiAwAh9wJAAMwDACEFDgAAzwcAIBEAAL8HACAZAACECAAg3AIAAMYGACD2AgAAxgYAIA8OAAD_AwAgEQAArwQAIBkAALAEACCiAgAArAQAMKMCAAAqABCkAgAArAQAMKUCAQAAAAGpAkAAzAMAIcMCAACuBPYCIsQCAQDJAwAh3AIBAOIDACHzAgEAyQMAIfQCAgCtBAAh9gIBAOIDACH3AkAAzAMAIQMAAAAqACADAAArADAEAAAsACAODgAA_wMAIBgAAIAEACCiAgAA_gMAMKMCAAAuABCkAgAA_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_QcAIDwAAP4HACA9AACBCAAgPgAAgAgAID8AAP8HACCCAwAAxgYAIIYDAADGBgAghwMAAMYGACCIAwAAxgYAIA6iAgAAoQQAMKMCAABtABCkAgAAoQQAMKUCAQC8AwAhqQJAAL8DACGqAkAAvwMAIcoCAQC8AwAhggMBANEDACGDAwEAvQMAIYQDAQC9AwAhhQMBAL0DACGGAwEA0QMAIYcDEACiBAAhiAMQAKIEACEDAAAAUQAgAwAAbAAwOwAAbQAgAwAAAFEAIAMAAFIAMAQAAAEAIAEAAAASACABAAAAEgAgAwAAAAUAIAMAABEAMAQAABIAIAMAAAAFACADAAARADAEAAASACADAAAABQAgAwAAEQAwBAAAEgAgDAIAALkGACAaAAC7BgAgIQAAggcAICIAALoGACClAgEAAAABqQJAAAAAAaoCQAAAAAHnAgEAAAAB_QIBAAAAAf4CAQAAAAH_AgEAAAABgQMAAACBAwIBLwAAdQAgCKUCAQAAAAGpAkAAAAABqgJAAAAAAecCAQAAAAH9AgEAAAAB_gIBAAAAAf8CAQAAAAGBAwAAAIEDAgEvAAB3ADABLwAAdwAwDAIAAJ8GACAaAAChBgAgIQAAgQcAICIAAKAGACClAgEAxwQAIakCQADJBAAhqgJAAMkEACHnAgEAxwQAIf0CAQDHBAAh_gIBAMcEACH_AgEAxwQAIYEDAACdBoEDIgIAAAASACAvAAB6ACAIpQIBAMcEACGpAkAAyQQAIaoCQADJBAAh5wIBAMcEACH9AgEAxwQAIf4CAQDHBAAh_wIBAMcEACGBAwAAnQaBAyICAAAABQAgLwAAfAAgAgAAAAUAIC8AAHwAIAMAAAASACA2AAB1ACA3AAB6ACABAAAAEgAgAQAAAAUAIAMIAAD6BwAgPgAA_AcAID8AAPsHACALogIAAJ0EADCjAgAAgwEAEKQCAACdBAAwpQIBALwDACGpAkAAvwMAIaoCQAC_AwAh5wIBALwDACH9AgEAvAMAIf4CAQC9AwAh_wIBAL0DACGBAwAAngSBAyIDAAAABQAgAwAAggEAMDsAAIMBACADAAAABQAgAwAAEQAwBAAAEgAgAQAAACIAIAEAAAAiACADAAAAIAAgAwAAIQAwBAAAIgAgAwAAACAAIAMAACEAMAQAACIAIAMAAAAgACADAAAhADAEAAAiACANDgAAtwYAIBEAAOwFACASAADtBQAgpQIBAAAAAakCQAAAAAGqAkAAAAABwwIAAAD6AgLEAgEAAAAB8wIBAAAAAfgCAQAAAAH6AkAAAAAB-wJAAAAAAfwCQAAAAAEBLwAAiwEAIAqlAgEAAAABqQJAAAAAAaoCQAAAAAHDAgAAAPoCAsQCAQAAAAHzAgEAAAAB-AIBAAAAAfoCQAAAAAH7AkAAAAAB_AJAAAAAAQEvAACNAQAwAS8AAI0BADABAAAAHgAgDQ4AALUGACARAADpBQAgEgAA6gUAIKUCAQDHBAAhqQJAAMkEACGqAkAAyQQAIcMCAADnBfoCIsQCAQDHBAAh8wIBAMcEACH4AgEA4wQAIfoCQADJBAAh-wJAAPUEACH8AkAA9QQAIQIAAAAiACAvAACRAQAgCqUCAQDHBAAhqQJAAMkEACGqAkAAyQQAIcMCAADnBfoCIsQCAQDHBAAh8wIBAMcEACH4AgEA4wQAIfoCQADJBAAh-wJAAPUEACH8AkAA9QQAIQIAAAAgACAvAACTAQAgAgAAACAAIC8AAJMBACABAAAAHgAgAwAAACIAIDYAAIsBACA3AACRAQAgAQAAACIAIAEAAAAgACAGCAAA9wcAID4AAPkHACA_AAD4BwAg-AIAAMYGACD7AgAAxgYAIPwCAADGBgAgDaICAACZBAAwowIAAJsBABCkAgAAmQQAMKUCAQC8AwAhqQJAAL8DACGqAkAAvwMAIcMCAACaBPoCIsQCAQC8AwAh8wIBALwDACH4AgEA7wMAIfoCQAC_AwAh-wJAAPYDACH8AkAA9gMAIQMAAAAgACADAACaAQAwOwAAmwEAIAMAAAAgACADAAAhADAEAAAiACAKAgAAlgQAICYAAJcEACAnAACYBAAgogIAAJUEADCjAgAAAwAQpAIAAJUEADClAgEAAAABqQJAAMwDACGqAkAAzAMAIecCAQAAAAEBAAAAngEAIAEAAACeAQAgAwIAAPQHACAmAAD1BwAgJwAA9gcAIAMAAAADACADAAChAQAwBAAAngEAIAMAAAADACADAAChAQAwBAAAngEAIAMAAAADACADAAChAQAwBAAAngEAIAcCAADzBwAgJgAAtgcAICcAALcHACClAgEAAAABqQJAAAAAAaoCQAAAAAHnAgEAAAABAS8AAKUBACAEpQIBAAAAAakCQAAAAAGqAkAAAAAB5wIBAAAAAQEvAACnAQAwAS8AAKcBADAHAgAA8gcAICYAAIgHACAnAACJBwAgpQIBAMcEACGpAkAAyQQAIaoCQADJBAAh5wIBAMcEACECAAAAngEAIC8AAKoBACAEpQIBAMcEACGpAkAAyQQAIaoCQADJBAAh5wIBAMcEACECAAAAAwAgLwAArAEAIAIAAAADACAvAACsAQAgAwAAAJ4BACA2AAClAQAgNwAAqgEAIAEAAACeAQAgAQAAAAMAIAMIAADvBwAgPgAA8QcAID8AAPAHACAHogIAAJQEADCjAgAAswEAEKQCAACUBAAwpQIBALwDACGpAkAAvwMAIaoCQAC_AwAh5wIBALwDACEDAAAAAwAgAwAAsgEAMDsAALMBACADAAAAAwAgAwAAoQEAMAQAAJ4BACABAAAALAAgAQAAACwAIAMAAAAqACADAAArADAEAAAsACADAAAAKgAgAwAAKwAwBAAALAAgAwAAACoAIAMAACsAMAQAACwAIAwOAACsBgAgEQAA0gUAIBkAANMFACClAgEAAAABqQJAAAAAAcMCAAAA9gICxAIBAAAAAdwCAQAAAAHzAgEAAAAB9AICAAAAAfYCAQAAAAH3AkAAAAABAS8AALsBACAJpQIBAAAAAakCQAAAAAHDAgAAAPYCAsQCAQAAAAHcAgEAAAAB8wIBAAAAAfQCAgAAAAH2AgEAAAAB9wJAAAAAAQEvAAC9AQAwAS8AAL0BADAMDgAAqgYAIBEAAMgFACAZAADJBQAgpQIBAMcEACGpAkAAyQQAIcMCAADGBfYCIsQCAQDHBAAh3AIBAOMEACHzAgEAxwQAIfQCAgDFBQAh9gIBAOMEACH3AkAAyQQAIQIAAAAsACAvAADAAQAgCaUCAQDHBAAhqQJAAMkEACHDAgAAxgX2AiLEAgEAxwQAIdwCAQDjBAAh8wIBAMcEACH0AgIAxQUAIfYCAQDjBAAh9wJAAMkEACECAAAAKgAgLwAAwgEAIAIAAAAqACAvAADCAQAgAwAAACwAIDYAALsBACA3AADAAQAgAQAAACwAIAEAAAAqACAHCAAA6gcAIDwAAOsHACA9AADuBwAgPgAA7QcAID8AAOwHACDcAgAAxgYAIPYCAADGBgAgDKICAACNBAAwowIAAMkBABCkAgAAjQQAMKUCAQC8AwAhqQJAAL8DACHDAgAAjwT2AiLEAgEAvAMAIdwCAQDRAwAh8wIBALwDACH0AgIAjgQAIfYCAQDRAwAh9wJAAL8DACEDAAAAKgAgAwAAyAEAMDsAAMkBACADAAAAKgAgAwAAKwAwBAAALAAgAQAAAAkAIAEAAAAJACADAAAABwAgAwAACAAwBAAACQAgAwAAAAcAIAMAAAgAMAQAAAkAIAMAAAAHACADAAAIADAEAAAJACAPBgAA6QcAIAkAAL0GACAdAAC-BgAgHgAAvwYAIB8AAMAGACAgAADBBgAgpQIBAAAAAaYCAQAAAAGnAgEAAAABqAIgAAAAAakCQAAAAAGqAkAAAAABvwIBAAAAAd0CAQAAAAHyAgEAAAABAS8AANEBACAJpQIBAAAAAaYCAQAAAAGnAgEAAAABqAIgAAAAAakCQAAAAAGqAkAAAAABvwIBAAAAAd0CAQAAAAHyAgEAAAABAS8AANMBADABLwAA0wEAMA8GAADoBwAgCQAA5QQAIB0AAOYEACAeAADnBAAgHwAA6AQAICAAAOkEACClAgEAxwQAIaYCAQDHBAAhpwIBAMcEACGoAiAAyAQAIakCQADJBAAhqgJAAMkEACG_AgEA4wQAId0CAQDHBAAh8gIBAMcEACECAAAACQAgLwAA1gEAIAmlAgEAxwQAIaYCAQDHBAAhpwIBAMcEACGoAiAAyAQAIakCQADJBAAhqgJAAMkEACG_AgEA4wQAId0CAQDHBAAh8gIBAMcEACECAAAABwAgLwAA2AEAIAIAAAAHACAvAADYAQAgAwAAAAkAIDYAANEBACA3AADWAQAgAQAAAAkAIAEAAAAHACAECAAA5QcAID4AAOcHACA_AADmBwAgvwIAAMYGACAMogIAAIwEADCjAgAA3wEAEKQCAACMBAAwpQIBALwDACGmAgEAvQMAIacCAQC9AwAhqAIgAL4DACGpAkAAvwMAIaoCQAC_AwAhvwIBANEDACHdAgEAvAMAIfICAQC9AwAhAwAAAAcAIAMAAN4BADA7AADfAQAgAwAAAAcAIAMAAAgAMAQAAAkAIAEAAAAnACABAAAAJwAgAwAAACUAIAMAACYAMAQAACcAIAMAAAAlACADAAAmADAEAAAnACADAAAAJQAgAwAAJgAwBAAAJwAgDg4AAPsEACAUAAD8BAAgFQAAiAUAIBYAAP0EACClAgEAAAABqQJAAAAAAaoCQAAAAAHDAgAAAO8CAsQCAQAAAAHsAgEAAAAB7QIBAAAAAe8CQAAAAAHwAkAAAAAB8QIBAAAAAQEvAADnAQAgCqUCAQAAAAGpAkAAAAABqgJAAAAAAcMCAAAA7wICxAIBAAAAAewCAQAAAAHtAgEAAAAB7wJAAAAAAfACQAAAAAHxAgEAAAABAS8AAOkBADABLwAA6QEAMAEAAAAeACAODgAA9wQAIBQAAPgEACAVAACGBQAgFgAA-QQAIKUCAQDHBAAhqQJAAMkEACGqAkAAyQQAIcMCAAD0BO8CIsQCAQDHBAAh7AIBAMcEACHtAgEAxwQAIe8CQAD1BAAh8AJAAPUEACHxAgEA4wQAIQIAAAAnACAvAADtAQAgCqUCAQDHBAAhqQJAAMkEACGqAkAAyQQAIcMCAAD0BO8CIsQCAQDHBAAh7AIBAMcEACHtAgEAxwQAIe8CQAD1BAAh8AJAAPUEACHxAgEA4wQAIQIAAAAlACAvAADvAQAgAgAAACUAIC8AAO8BACABAAAAHgAgAwAAACcAIDYAAOcBACA3AADtAQAgAQAAACcAIAEAAAAlACAGCAAA4gcAID4AAOQHACA_AADjBwAg7wIAAMYGACDwAgAAxgYAIPECAADGBgAgDaICAACIBAAwowIAAPcBABCkAgAAiAQAMKUCAQC8AwAhqQJAAL8DACGqAkAAvwMAIcMCAACJBO8CIsQCAQC8AwAh7AIBALwDACHtAgEAvAMAIe8CQAD2AwAh8AJAAPYDACHxAgEA7wMAIQMAAAAlACADAAD2AQAwOwAA9wEAIAMAAAAlACADAAAmADAEAAAnACABAAAANQAgAQAAADUAIAMAAAAzACADAAA0ADAEAAA1ACADAAAAMwAgAwAANAAwBAAANQAgAwAAADMAIAMAADQAMAQAADUAIAoCAACuBQAgDgAA3gYAIKUCAQAAAAGpAkAAAAABxAIBAAAAAecCAQAAAAHoAgEAAAAB6QIBAAAAAeoCAQAAAAHrAiAAAAABAS8AAP8BACAIpQIBAAAAAakCQAAAAAHEAgEAAAAB5wIBAAAAAegCAQAAAAHpAgEAAAAB6gIBAAAAAesCIAAAAAEBLwAAgQIAMAEvAACBAgAwAQAAABQAIAoCAACsBQAgDgAA3AYAIKUCAQDHBAAhqQJAAMkEACHEAgEA4wQAIecCAQDHBAAh6AIBAMcEACHpAgEAxwQAIeoCAQDHBAAh6wIgAMgEACECAAAANQAgLwAAhQIAIAilAgEAxwQAIakCQADJBAAhxAIBAOMEACHnAgEAxwQAIegCAQDHBAAh6QIBAMcEACHqAgEAxwQAIesCIADIBAAhAgAAADMAIC8AAIcCACACAAAAMwAgLwAAhwIAIAEAAAAUACADAAAANQAgNgAA_wEAIDcAAIUCACABAAAANQAgAQAAADMAIAQIAADfBwAgPgAA4QcAID8AAOAHACDEAgAAxgYAIAuiAgAAhwQAMKMCAACPAgAQpAIAAIcEADClAgEAvAMAIakCQAC_AwAhxAIBAO8DACHnAgEAvAMAIegCAQC9AwAh6QIBAL0DACHqAgEAvQMAIesCIAC-AwAhAwAAADMAIAMAAI4CADA7AACPAgAgAwAAADMAIAMAADQAMAQAADUAIA4OAAD_AwAgogIAAIMEADCjAgAAMQAQpAIAAIMEADClAgEAAAABqQJAAMwDACGqAkAAzAMAIcMCAACFBNUCIsQCAQAAAAHiAhAAhAQAIeMCAQDKAwAh5AIBAMoDACHlAgEAAAAB5gJAAIYEACEBAAAAkgIAIAEAAACSAgAgAw4AAM8HACDlAgAAxgYAIOYCAADGBgAgAwAAADEAIAMAAJUCADAEAACSAgAgAwAAADEAIAMAAJUCADAEAACSAgAgAwAAADEAIAMAAJUCADAEAACSAgAgCw4AAN4HACClAgEAAAABqQJAAAAAAaoCQAAAAAHDAgAAANUCAsQCAQAAAAHiAhAAAAAB4wIBAAAAAeQCAQAAAAHlAgEAAAAB5gJAAAAAAQEvAACZAgAgCqUCAQAAAAGpAkAAAAABqgJAAAAAAcMCAAAA1QICxAIBAAAAAeICEAAAAAHjAgEAAAAB5AIBAAAAAeUCAQAAAAHmAkAAAAABAS8AAJsCADABLwAAmwIAMAsOAADdBwAgpQIBAMcEACGpAkAAyQQAIaoCQADJBAAhwwIAAJQF1QIixAIBAMcEACHiAhAA1gQAIeMCAQDHBAAh5AIBAMcEACHlAgEA4wQAIeYCQAD1BAAhAgAAAJICACAvAACeAgAgCqUCAQDHBAAhqQJAAMkEACGqAkAAyQQAIcMCAACUBdUCIsQCAQDHBAAh4gIQANYEACHjAgEAxwQAIeQCAQDHBAAh5QIBAOMEACHmAkAA9QQAIQIAAAAxACAvAACgAgAgAgAAADEAIC8AAKACACADAAAAkgIAIDYAAJkCACA3AACeAgAgAQAAAJICACABAAAAMQAgBwgAANgHACA8AADZBwAgPQAA3AcAID4AANsHACA_AADaBwAg5QIAAMYGACDmAgAAxgYAIA2iAgAAggQAMKMCAACnAgAQpAIAAIIEADClAgEAvAMAIakCQAC_AwAhqgJAAL8DACHDAgAA9QPVAiLEAgEAvAMAIeICEAD0AwAh4wIBAL0DACHkAgEAvQMAIeUCAQDRAwAh5gJAAPYDACEDAAAAMQAgAwAApgIAMDsAAKcCACADAAAAMQAgAwAAlQIAMAQAAJICACABAAAADQAgAQAAAA0AIAMAAAALACADAAAMADAEAAANACADAAAACwAgAwAADAAwBAAADQAgAwAAAAsAIAMAAAwAMAQAAA0AIAsGAADXBwAgpQIBAAAAAagCIAAAAAGpAkAAAAABqgJAAAAAAdICAQAAAAHdAgEAAAAB3gIQAAAAAd8CEAAAAAHgAhAAAAAB4QIQAAAAAQEvAACvAgAgCqUCAQAAAAGoAiAAAAABqQJAAAAAAaoCQAAAAAHSAgEAAAAB3QIBAAAAAd4CEAAAAAHfAhAAAAAB4AIQAAAAAeECEAAAAAEBLwAAsQIAMAEvAACxAgAwCwYAANYHACClAgEAxwQAIagCIADIBAAhqQJAAMkEACGqAkAAyQQAIdICAQDHBAAh3QIBAMcEACHeAhAA1gQAId8CEADWBAAh4AIQANYEACHhAhAA1gQAIQIAAAANACAvAAC0AgAgCqUCAQDHBAAhqAIgAMgEACGpAkAAyQQAIaoCQADJBAAh0gIBAMcEACHdAgEAxwQAId4CEADWBAAh3wIQANYEACHgAhAA1gQAIeECEADWBAAhAgAAAAsAIC8AALYCACACAAAACwAgLwAAtgIAIAMAAAANACA2AACvAgAgNwAAtAIAIAEAAAANACABAAAACwAgBQgAANEHACA8AADSBwAgPQAA1QcAID4AANQHACA_AADTBwAgDaICAACBBAAwowIAAL0CABCkAgAAgQQAMKUCAQC8AwAhqAIgAL4DACGpAkAAvwMAIaoCQAC_AwAh0gIBAL0DACHdAgEAvAMAId4CEAD0AwAh3wIQAPQDACHgAhAA9AMAIeECEAD0AwAhAwAAAAsAIAMAALwCADA7AAC9AgAgAwAAAAsAIAMAAAwAMAQAAA0AIA4OAAD_AwAgGAAAgAQAIKICAAD-AwAwowIAAC4AEKQCAAD-AwAwpQIBAAAAAakCQADMAwAhxAIBAAAAAdcCAQAAAAHYAgEAygMAIdkCAQDKAwAh2gIBAOIDACHbAgEA4gMAIdwCAQDiAwAhAQAAAMACACABAAAAwAIAIAUOAADPBwAgGAAA0AcAINoCAADGBgAg2wIAAMYGACDcAgAAxgYAIAMAAAAuACADAADDAgAwBAAAwAIAIAMAAAAuACADAADDAgAwBAAAwAIAIAMAAAAuACADAADDAgAwBAAAwAIAIAsOAADQBQAgGAAAugUAIKUCAQAAAAGpAkAAAAABxAIBAAAAAdcCAQAAAAHYAgEAAAAB2QIBAAAAAdoCAQAAAAHbAgEAAAAB3AIBAAAAAQEvAADHAgAgCaUCAQAAAAGpAkAAAAABxAIBAAAAAdcCAQAAAAHYAgEAAAAB2QIBAAAAAdoCAQAAAAHbAgEAAAAB3AIBAAAAAQEvAADJAgAwAS8AAMkCADALDgAAzwUAIBgAALkFACClAgEAxwQAIakCQADJBAAhxAIBAMcEACHXAgEAxwQAIdgCAQDHBAAh2QIBAMcEACHaAgEA4wQAIdsCAQDjBAAh3AIBAOMEACECAAAAwAIAIC8AAMwCACAJpQIBAMcEACGpAkAAyQQAIcQCAQDHBAAh1wIBAMcEACHYAgEAxwQAIdkCAQDHBAAh2gIBAOMEACHbAgEA4wQAIdwCAQDjBAAhAgAAAC4AIC8AAM4CACACAAAALgAgLwAAzgIAIAMAAADAAgAgNgAAxwIAIDcAAMwCACABAAAAwAIAIAEAAAAuACAGCAAAzAcAID4AAM4HACA_AADNBwAg2gIAAMYGACDbAgAAxgYAINwCAADGBgAgDKICAAD9AwAwowIAANUCABCkAgAA_QMAMKUCAQC8AwAhqQJAAL8DACHEAgEAvAMAIdcCAQC8AwAh2AIBAL0DACHZAgEAvQMAIdoCAQDRAwAh2wIBANEDACHcAgEA0QMAIQMAAAAuACADAADUAgAwOwAA1QIAIAMAAAAuACADAADDAgAwBAAAwAIAIAEAAAAWACABAAAAFgAgAwAAABQAIAMAABUAMAQAABYAIAMAAAAUACADAAAVADAEAAAWACADAAAAFAAgAwAAFQAwBAAAFgAgHQEAAP0FACAKAAD-BQAgCwAA_wUAIAwAAIAGACANAACSBgAgEAAAgQYAIBMAAIIGACAXAACDBgAgGQAAhQYAIBoAAIQGACAbAACGBgAgHAAAhwYAIKUCAQAAAAGpAkAAAAABqgJAAAAAAcMCAAAAxgICyQIBAAAAAcoCAQAAAAHLAgEAAAABzAIBAAAAAc0CAQAAAAHOAgEAAAABzwIBAAAAAdACEAAAAAHRAgEAAAAB0gIBAAAAAdMCEAAAAAHVAgAAANUCAtYCQAAAAAEBLwAA3QIAIBGlAgEAAAABqQJAAAAAAaoCQAAAAAHDAgAAAMYCAskCAQAAAAHKAgEAAAABywIBAAAAAcwCAQAAAAHNAgEAAAABzgIBAAAAAc8CAQAAAAHQAhAAAAAB0QIBAAAAAdICAQAAAAHTAhAAAAAB1QIAAADVAgLWAkAAAAABAS8AAN8CADABLwAA3wIAMAEAAAAHACABAAAABwAgHQEAAJYFACAKAACXBQAgCwAAmAUAIAwAAJkFACANAACQBgAgEAAAmgUAIBMAAJsFACAXAACcBQAgGQAAngUAIBoAAJ0FACAbAACfBQAgHAAAoAUAIKUCAQDHBAAhqQJAAMkEACGqAkAAyQQAIcMCAACTBcYCIskCAQDHBAAhygIBAMcEACHLAgEAxwQAIcwCAQDHBAAhzQIBAOMEACHOAgEA4wQAIc8CAQDHBAAh0AIQANYEACHRAgEA4wQAIdICAQDHBAAh0wIQANYEACHVAgAAlAXVAiLWAkAA9QQAIQIAAAAWACAvAADkAgAgEaUCAQDHBAAhqQJAAMkEACGqAkAAyQQAIcMCAACTBcYCIskCAQDHBAAhygIBAMcEACHLAgEAxwQAIcwCAQDHBAAhzQIBAOMEACHOAgEA4wQAIc8CAQDHBAAh0AIQANYEACHRAgEA4wQAIdICAQDHBAAh0wIQANYEACHVAgAAlAXVAiLWAkAA9QQAIQIAAAAUACAvAADmAgAgAgAAABQAIC8AAOYCACABAAAABwAgAQAAAAcAIAMAAAAWACA2AADdAgAgNwAA5AIAIAEAAAAWACABAAAAFAAgCQgAAMcHACA8AADIBwAgPQAAywcAID4AAMoHACA_AADJBwAgzQIAAMYGACDOAgAAxgYAINECAADGBgAg1gIAAMYGACAUogIAAPMDADCjAgAA7wIAEKQCAADzAwAwpQIBALwDACGpAkAAvwMAIaoCQAC_AwAhwwIAAO4DxgIiyQIBAL0DACHKAgEAvAMAIcsCAQC8AwAhzAIBALwDACHNAgEA7wMAIc4CAQDvAwAhzwIBAL0DACHQAhAA9AMAIdECAQDRAwAh0gIBAL0DACHTAhAA9AMAIdUCAAD1A9UCItYCQAD2AwAhAwAAABQAIAMAAO4CADA7AADvAgAgAwAAABQAIAMAABUAMAQAABYAIAEAAAAcACABAAAAHAAgAwAAABoAIAMAABsAMAQAABwAIAMAAAAaACADAAAbADAEAAAcACADAAAAGgAgAwAAGwAwBAAAHAAgCQ4AAPsGACAPAAD7BQAgpQIBAAAAAakCQAAAAAHDAgAAAMYCAsQCAQAAAAHGAgEAAAABxwIBAAAAAcgCAQAAAAEBLwAA9wIAIAelAgEAAAABqQJAAAAAAcMCAAAAxgICxAIBAAAAAcYCAQAAAAHHAgEAAAAByAIBAAAAAQEvAAD5AgAwAS8AAPkCADABAAAAHgAgCQ4AAPkGACAPAAD5BQAgpQIBAMcEACGpAkAAyQQAIcMCAACTBcYCIsQCAQDHBAAhxgIBAOMEACHHAgEA4wQAIcgCAQDjBAAhAgAAABwAIC8AAP0CACAHpQIBAMcEACGpAkAAyQQAIcMCAACTBcYCIsQCAQDHBAAhxgIBAOMEACHHAgEA4wQAIcgCAQDjBAAhAgAAABoAIC8AAP8CACACAAAAGgAgLwAA_wIAIAEAAAAeACADAAAAHAAgNgAA9wIAIDcAAP0CACABAAAAHAAgAQAAABoAIAYIAADEBwAgPgAAxgcAID8AAMUHACDGAgAAxgYAIMcCAADGBgAgyAIAAMYGACAKogIAAO0DADCjAgAAhwMAEKQCAADtAwAwpQIBALwDACGpAkAAvwMAIcMCAADuA8YCIsQCAQC8AwAhxgIBANEDACHHAgEA0QMAIcgCAQDvAwAhAwAAABoAIAMAAIYDADA7AACHAwAgAwAAABoAIAMAABsAMAQAABwAIBUBAADnAwAgEQAA6AMAIBwAAOwDACAjAADpAwAgJAAA6gMAICUAAOsDACCiAgAA4QMAMKMCAAAeABCkAgAA4QMAMKUCAQAAAAGmAgEAygMAIakCQADMAwAhqgJAAMwDACG5AgEAAAABugIBAOIDACG7AgEAAAABvQIAAOMDvQIivgIgAOQDACG_AgEAAAABwQIAAOUDwQIiwwIAAOYDwwIiAQAAAIoDACABAAAAigMAIAoBAAC-BwAgEQAAvwcAIBwAAMMHACAjAADABwAgJAAAwQcAICUAAMIHACC6AgAAxgYAILsCAADGBgAgvgIAAMYGACC_AgAAxgYAIAMAAAAeACADAACNAwAwBAAAigMAIAMAAAAeACADAACNAwAwBAAAigMAIAMAAAAeACADAACNAwAwBAAAigMAIBIBAAC4BwAgEQAAuQcAIBwAAL0HACAjAAC6BwAgJAAAuwcAICUAALwHACClAgEAAAABpgIBAAAAAakCQAAAAAGqAkAAAAABuQIBAAAAAboCAQAAAAG7AgEAAAABvQIAAAC9AgK-AiAAAAABvwIBAAAAAcECAAAAwQICwwIAAADDAgIBLwAAkQMAIAylAgEAAAABpgIBAAAAAakCQAAAAAGqAkAAAAABuQIBAAAAAboCAQAAAAG7AgEAAAABvQIAAAC9AgK-AiAAAAABvwIBAAAAAcECAAAAwQICwwIAAADDAgIBLwAAkwMAMAEvAACTAwAwEgEAAM4GACARAADPBgAgHAAA0wYAICMAANAGACAkAADRBgAgJQAA0gYAIKUCAQDHBAAhpgIBAMcEACGpAkAAyQQAIaoCQADJBAAhuQIBAMcEACG6AgEA4wQAIbsCAQDjBAAhvQIAAMoGvQIivgIgAMsGACG_AgEA4wQAIcECAADMBsECIsMCAADNBsMCIgIAAACKAwAgLwAAlgMAIAylAgEAxwQAIaYCAQDHBAAhqQJAAMkEACGqAkAAyQQAIbkCAQDHBAAhugIBAOMEACG7AgEA4wQAIb0CAADKBr0CIr4CIADLBgAhvwIBAOMEACHBAgAAzAbBAiLDAgAAzQbDAiICAAAAHgAgLwAAmAMAIAIAAAAeACAvAACYAwAgAwAAAIoDACA2AACRAwAgNwAAlgMAIAEAAACKAwAgAQAAAB4AIAcIAADHBgAgPgAAyQYAID8AAMgGACC6AgAAxgYAILsCAADGBgAgvgIAAMYGACC_AgAAxgYAIA-iAgAA0AMAMKMCAACfAwAQpAIAANADADClAgEAvAMAIaYCAQC9AwAhqQJAAL8DACGqAkAAvwMAIbkCAQC9AwAhugIBANEDACG7AgEA0QMAIb0CAADSA70CIr4CIADTAwAhvwIBANEDACHBAgAA1APBAiLDAgAA1QPDAiIDAAAAHgAgAwAAngMAMDsAAJ8DACADAAAAHgAgAwAAjQMAMAQAAIoDACALBQAAzQMAIAcAAM4DACCiAgAAyAMAMKMCAAClAwAQpAIAAMgDADClAgEAAAABpgIBAMoDACGnAgEAAAABqAIgAMsDACGpAkAAzAMAIaoCQADMAwAhAQAAAKIDACABAAAAogMAIAsFAADNAwAgBwAAzgMAIKICAADIAwAwowIAAKUDABCkAgAAyAMAMKUCAQDJAwAhpgIBAMoDACGnAgEAygMAIagCIADLAwAhqQJAAMwDACGqAkAAzAMAIQIFAADEBgAgBwAAxQYAIAMAAAClAwAgAwAApgMAMAQAAKIDACADAAAApQMAIAMAAKYDADAEAACiAwAgAwAAAKUDACADAACmAwAwBAAAogMAIAgFAADCBgAgBwAAwwYAIKUCAQAAAAGmAgEAAAABpwIBAAAAAagCIAAAAAGpAkAAAAABqgJAAAAAAQEvAACqAwAgBqUCAQAAAAGmAgEAAAABpwIBAAAAAagCIAAAAAGpAkAAAAABqgJAAAAAAQEvAACsAwAwAS8AAKwDADAIBQAAygQAIAcAAMsEACClAgEAxwQAIaYCAQDHBAAhpwIBAMcEACGoAiAAyAQAIakCQADJBAAhqgJAAMkEACECAAAAogMAIC8AAK8DACAGpQIBAMcEACGmAgEAxwQAIacCAQDHBAAhqAIgAMgEACGpAkAAyQQAIaoCQADJBAAhAgAAAKUDACAvAACxAwAgAgAAAKUDACAvAACxAwAgAwAAAKIDACA2AACqAwAgNwAArwMAIAEAAACiAwAgAQAAAKUDACADCAAAxAQAID4AAMYEACA_AADFBAAgCaICAAC7AwAwowIAALgDABCkAgAAuwMAMKUCAQC8AwAhpgIBAL0DACGnAgEAvQMAIagCIAC-AwAhqQJAAL8DACGqAkAAvwMAIQMAAAClAwAgAwAAtwMAMDsAALgDACADAAAApQMAIAMAAKYDADAEAACiAwAgCaICAAC7AwAwowIAALgDABCkAgAAuwMAMKUCAQC8AwAhpgIBAL0DACGnAgEAvQMAIagCIAC-AwAhqQJAAL8DACGqAkAAvwMAIQsIAADBAwAgPgAAxgMAID8AAMYDACCrAgEAAAABrAIBAAAABK0CAQAAAASuAgEAAAABrwIBAAAAAbACAQAAAAGxAgEAAAABsgIBAMcDACEOCAAAwQMAID4AAMYDACA_AADGAwAgqwIBAAAAAawCAQAAAAStAgEAAAAErgIBAAAAAa8CAQAAAAGwAgEAAAABsQIBAAAAAbICAQDFAwAhswIBAAAAAbQCAQAAAAG1AgEAAAABBQgAAMEDACA-AADEAwAgPwAAxAMAIKsCIAAAAAGyAiAAwwMAIQsIAADBAwAgPgAAwgMAID8AAMIDACCrAkAAAAABrAJAAAAABK0CQAAAAASuAkAAAAABrwJAAAAAAbACQAAAAAGxAkAAAAABsgJAAMADACELCAAAwQMAID4AAMIDACA_AADCAwAgqwJAAAAAAawCQAAAAAStAkAAAAAErgJAAAAAAa8CQAAAAAGwAkAAAAABsQJAAAAAAbICQADAAwAhCKsCAgAAAAGsAgIAAAAErQICAAAABK4CAgAAAAGvAgIAAAABsAICAAAAAbECAgAAAAGyAgIAwQMAIQirAkAAAAABrAJAAAAABK0CQAAAAASuAkAAAAABrwJAAAAAAbACQAAAAAGxAkAAAAABsgJAAMIDACEFCAAAwQMAID4AAMQDACA_AADEAwAgqwIgAAAAAbICIADDAwAhAqsCIAAAAAGyAiAAxAMAIQ4IAADBAwAgPgAAxgMAID8AAMYDACCrAgEAAAABrAIBAAAABK0CAQAAAASuAgEAAAABrwIBAAAAAbACAQAAAAGxAgEAAAABsgIBAMUDACGzAgEAAAABtAIBAAAAAbUCAQAAAAELqwIBAAAAAawCAQAAAAStAgEAAAAErgIBAAAAAa8CAQAAAAGwAgEAAAABsQIBAAAAAbICAQDGAwAhswIBAAAAAbQCAQAAAAG1AgEAAAABCwgAAMEDACA-AADGAwAgPwAAxgMAIKsCAQAAAAGsAgEAAAAErQIBAAAABK4CAQAAAAGvAgEAAAABsAIBAAAAAbECAQAAAAGyAgEAxwMAIQsFAADNAwAgBwAAzgMAIKICAADIAwAwowIAAKUDABCkAgAAyAMAMKUCAQDJAwAhpgIBAMoDACGnAgEAygMAIagCIADLAwAhqQJAAMwDACGqAkAAzAMAIQirAgEAAAABrAIBAAAABK0CAQAAAASuAgEAAAABrwIBAAAAAbACAQAAAAGxAgEAAAABsgIBAM8DACELqwIBAAAAAawCAQAAAAStAgEAAAAErgIBAAAAAa8CAQAAAAGwAgEAAAABsQIBAAAAAbICAQDGAwAhswIBAAAAAbQCAQAAAAG1AgEAAAABAqsCIAAAAAGyAiAAxAMAIQirAkAAAAABrAJAAAAABK0CQAAAAASuAkAAAAABrwJAAAAAAbACQAAAAAGxAkAAAAABsgJAAMIDACEDtgIAAAcAILcCAAAHACC4AgAABwAgA7YCAAALACC3AgAACwAguAIAAAsAIAirAgEAAAABrAIBAAAABK0CAQAAAASuAgEAAAABrwIBAAAAAbACAQAAAAGxAgEAAAABsgIBAM8DACEPogIAANADADCjAgAAnwMAEKQCAADQAwAwpQIBALwDACGmAgEAvQMAIakCQAC_AwAhqgJAAL8DACG5AgEAvQMAIboCAQDRAwAhuwIBANEDACG9AgAA0gO9AiK-AiAA0wMAIb8CAQDRAwAhwQIAANQDwQIiwwIAANUDwwIiDggAANsDACA-AADgAwAgPwAA4AMAIKsCAQAAAAGsAgEAAAAFrQIBAAAABa4CAQAAAAGvAgEAAAABsAIBAAAAAbECAQAAAAGyAgEA3wMAIbMCAQAAAAG0AgEAAAABtQIBAAAAAQcIAADBAwAgPgAA3gMAID8AAN4DACCrAgAAAL0CAqwCAAAAvQIIrQIAAAC9AgiyAgAA3QO9AiIFCAAA2wMAID4AANwDACA_AADcAwAgqwIgAAAAAbICIADaAwAhBwgAAMEDACA-AADZAwAgPwAA2QMAIKsCAAAAwQICrAIAAADBAgitAgAAAMECCLICAADYA8ECIgcIAADBAwAgPgAA1wMAID8AANcDACCrAgAAAMMCAqwCAAAAwwIIrQIAAADDAgiyAgAA1gPDAiIHCAAAwQMAID4AANcDACA_AADXAwAgqwIAAADDAgKsAgAAAMMCCK0CAAAAwwIIsgIAANYDwwIiBKsCAAAAwwICrAIAAADDAgitAgAAAMMCCLICAADXA8MCIgcIAADBAwAgPgAA2QMAID8AANkDACCrAgAAAMECAqwCAAAAwQIIrQIAAADBAgiyAgAA2APBAiIEqwIAAADBAgKsAgAAAMECCK0CAAAAwQIIsgIAANkDwQIiBQgAANsDACA-AADcAwAgPwAA3AMAIKsCIAAAAAGyAiAA2gMAIQirAgIAAAABrAICAAAABa0CAgAAAAWuAgIAAAABrwICAAAAAbACAgAAAAGxAgIAAAABsgICANsDACECqwIgAAAAAbICIADcAwAhBwgAAMEDACA-AADeAwAgPwAA3gMAIKsCAAAAvQICrAIAAAC9AgitAgAAAL0CCLICAADdA70CIgSrAgAAAL0CAqwCAAAAvQIIrQIAAAC9AgiyAgAA3gO9AiIOCAAA2wMAID4AAOADACA_AADgAwAgqwIBAAAAAawCAQAAAAWtAgEAAAAFrgIBAAAAAa8CAQAAAAGwAgEAAAABsQIBAAAAAbICAQDfAwAhswIBAAAAAbQCAQAAAAG1AgEAAAABC6sCAQAAAAGsAgEAAAAFrQIBAAAABa4CAQAAAAGvAgEAAAABsAIBAAAAAbECAQAAAAGyAgEA4AMAIbMCAQAAAAG0AgEAAAABtQIBAAAAARUBAADnAwAgEQAA6AMAIBwAAOwDACAjAADpAwAgJAAA6gMAICUAAOsDACCiAgAA4QMAMKMCAAAeABCkAgAA4QMAMKUCAQDJAwAhpgIBAMoDACGpAkAAzAMAIaoCQADMAwAhuQIBAMoDACG6AgEA4gMAIbsCAQDiAwAhvQIAAOMDvQIivgIgAOQDACG_AgEA4gMAIcECAADlA8ECIsMCAADmA8MCIgurAgEAAAABrAIBAAAABa0CAQAAAAWuAgEAAAABrwIBAAAAAbACAQAAAAGxAgEAAAABsgIBAOADACGzAgEAAAABtAIBAAAAAbUCAQAAAAEEqwIAAAC9AgKsAgAAAL0CCK0CAAAAvQIIsgIAAN4DvQIiAqsCIAAAAAGyAiAA3AMAIQSrAgAAAMECAqwCAAAAwQIIrQIAAADBAgiyAgAA2QPBAiIEqwIAAADDAgKsAgAAAMMCCK0CAAAAwwIIsgIAANcDwwIiDAIAAJYEACAmAACXBAAgJwAAmAQAIKICAACVBAAwowIAAAMAEKQCAACVBAAwpQIBAMkDACGpAkAAzAMAIaoCQADMAwAh5wIBAMkDACGJAwAAAwAgigMAAAMAIBECAACWBAAgGgAAvAQAICEAALMEACAiAADqAwAgogIAAL4EADCjAgAABQAQpAIAAL4EADClAgEAyQMAIakCQADMAwAhqgJAAMwDACHnAgEAyQMAIf0CAQDJAwAh_gIBAMoDACH_AgEAygMAIYEDAAC_BIEDIokDAAAFACCKAwAABQAgA7YCAAAaACC3AgAAGgAguAIAABoAIAO2AgAAIAAgtwIAACAAILgCAAAgACADtgIAACUAILcCAAAlACC4AgAAJQAgA7YCAAAzACC3AgAAMwAguAIAADMAIAqiAgAA7QMAMKMCAACHAwAQpAIAAO0DADClAgEAvAMAIakCQAC_AwAhwwIAAO4DxgIixAIBALwDACHGAgEA0QMAIccCAQDRAwAhyAIBAO8DACEHCAAAwQMAID4AAPIDACA_AADyAwAgqwIAAADGAgKsAgAAAMYCCK0CAAAAxgIIsgIAAPEDxgIiCwgAANsDACA-AADgAwAgPwAA4AMAIKsCAQAAAAGsAgEAAAAFrQIBAAAABa4CAQAAAAGvAgEAAAABsAIBAAAAAbECAQAAAAGyAgEA8AMAIQsIAADbAwAgPgAA4AMAID8AAOADACCrAgEAAAABrAIBAAAABa0CAQAAAAWuAgEAAAABrwIBAAAAAbACAQAAAAGxAgEAAAABsgIBAPADACEHCAAAwQMAID4AAPIDACA_AADyAwAgqwIAAADGAgKsAgAAAMYCCK0CAAAAxgIIsgIAAPEDxgIiBKsCAAAAxgICrAIAAADGAgitAgAAAMYCCLICAADyA8YCIhSiAgAA8wMAMKMCAADvAgAQpAIAAPMDADClAgEAvAMAIakCQAC_AwAhqgJAAL8DACHDAgAA7gPGAiLJAgEAvQMAIcoCAQC8AwAhywIBALwDACHMAgEAvAMAIc0CAQDvAwAhzgIBAO8DACHPAgEAvQMAIdACEAD0AwAh0QIBANEDACHSAgEAvQMAIdMCEAD0AwAh1QIAAPUD1QIi1gJAAPYDACENCAAAwQMAIDwAAPwDACA9AAD8AwAgPgAA_AMAID8AAPwDACCrAhAAAAABrAIQAAAABK0CEAAAAASuAhAAAAABrwIQAAAAAbACEAAAAAGxAhAAAAABsgIQAPsDACEHCAAAwQMAID4AAPoDACA_AAD6AwAgqwIAAADVAgKsAgAAANUCCK0CAAAA1QIIsgIAAPkD1QIiCwgAANsDACA-AAD4AwAgPwAA-AMAIKsCQAAAAAGsAkAAAAAFrQJAAAAABa4CQAAAAAGvAkAAAAABsAJAAAAAAbECQAAAAAGyAkAA9wMAIQsIAADbAwAgPgAA-AMAID8AAPgDACCrAkAAAAABrAJAAAAABa0CQAAAAAWuAkAAAAABrwJAAAAAAbACQAAAAAGxAkAAAAABsgJAAPcDACEIqwJAAAAAAawCQAAAAAWtAkAAAAAFrgJAAAAAAa8CQAAAAAGwAkAAAAABsQJAAAAAAbICQAD4AwAhBwgAAMEDACA-AAD6AwAgPwAA-gMAIKsCAAAA1QICrAIAAADVAgitAgAAANUCCLICAAD5A9UCIgSrAgAAANUCAqwCAAAA1QIIrQIAAADVAgiyAgAA-gPVAiINCAAAwQMAIDwAAPwDACA9AAD8AwAgPgAA_AMAID8AAPwDACCrAhAAAAABrAIQAAAABK0CEAAAAASuAhAAAAABrwIQAAAAAbACEAAAAAGxAhAAAAABsgIQAPsDACEIqwIQAAAAAawCEAAAAAStAhAAAAAErgIQAAAAAa8CEAAAAAGwAhAAAAABsQIQAAAAAbICEAD8AwAhDKICAAD9AwAwowIAANUCABCkAgAA_QMAMKUCAQC8AwAhqQJAAL8DACHEAgEAvAMAIdcCAQC8AwAh2AIBAL0DACHZAgEAvQMAIdoCAQDRAwAh2wIBANEDACHcAgEA0QMAIQ4OAAD_AwAgGAAAgAQAIKICAAD-AwAwowIAAC4AEKQCAAD-AwAwpQIBAMkDACGpAkAAzAMAIcQCAQDJAwAh1wIBAMkDACHYAgEAygMAIdkCAQDKAwAh2gIBAOIDACHbAgEA4gMAIdwCAQDiAwAhIgEAAKcEACAKAAC6BAAgCwAAugQAIAwAALsEACANAAC7BAAgEAAA6QMAIBMAAOoDACAXAADrAwAgGQAAsAQAIBoAALwEACAbAAC9BAAgHAAA7AMAIKICAAC5BAAwowIAABQAEKQCAAC5BAAwpQIBAMkDACGpAkAAzAMAIaoCQADMAwAhwwIAALgExgIiyQIBAMoDACHKAgEAyQMAIcsCAQDJAwAhzAIBAMkDACHNAgEAqQQAIc4CAQCpBAAhzwIBAMoDACHQAhAAhAQAIdECAQDiAwAh0gIBAMoDACHTAhAAhAQAIdUCAACFBNUCItYCQACGBAAhiQMAABQAIIoDAAAUACARDgAA_wMAIBEAAK8EACAZAACwBAAgogIAAKwEADCjAgAAKgAQpAIAAKwEADClAgEAyQMAIakCQADMAwAhwwIAAK4E9gIixAIBAMkDACHcAgEA4gMAIfMCAQDJAwAh9AICAK0EACH2AgEA4gMAIfcCQADMAwAhiQMAACoAIIoDAAAqACANogIAAIEEADCjAgAAvQIAEKQCAACBBAAwpQIBALwDACGoAiAAvgMAIakCQAC_AwAhqgJAAL8DACHSAgEAvQMAId0CAQC8AwAh3gIQAPQDACHfAhAA9AMAIeACEAD0AwAh4QIQAPQDACENogIAAIIEADCjAgAApwIAEKQCAACCBAAwpQIBALwDACGpAkAAvwMAIaoCQAC_AwAhwwIAAPUD1QIixAIBALwDACHiAhAA9AMAIeMCAQC9AwAh5AIBAL0DACHlAgEA0QMAIeYCQAD2AwAhDg4AAP8DACCiAgAAgwQAMKMCAAAxABCkAgAAgwQAMKUCAQDJAwAhqQJAAMwDACGqAkAAzAMAIcMCAACFBNUCIsQCAQDJAwAh4gIQAIQEACHjAgEAygMAIeQCAQDKAwAh5QIBAOIDACHmAkAAhgQAIQirAhAAAAABrAIQAAAABK0CEAAAAASuAhAAAAABrwIQAAAAAbACEAAAAAGxAhAAAAABsgIQAPwDACEEqwIAAADVAgKsAgAAANUCCK0CAAAA1QIIsgIAAPoD1QIiCKsCQAAAAAGsAkAAAAAFrQJAAAAABa4CQAAAAAGvAkAAAAABsAJAAAAAAbECQAAAAAGyAkAA-AMAIQuiAgAAhwQAMKMCAACPAgAQpAIAAIcEADClAgEAvAMAIakCQAC_AwAhxAIBAO8DACHnAgEAvAMAIegCAQC9AwAh6QIBAL0DACHqAgEAvQMAIesCIAC-AwAhDaICAACIBAAwowIAAPcBABCkAgAAiAQAMKUCAQC8AwAhqQJAAL8DACGqAkAAvwMAIcMCAACJBO8CIsQCAQC8AwAh7AIBALwDACHtAgEAvAMAIe8CQAD2AwAh8AJAAPYDACHxAgEA7wMAIQcIAADBAwAgPgAAiwQAID8AAIsEACCrAgAAAO8CAqwCAAAA7wIIrQIAAADvAgiyAgAAigTvAiIHCAAAwQMAID4AAIsEACA_AACLBAAgqwIAAADvAgKsAgAAAO8CCK0CAAAA7wIIsgIAAIoE7wIiBKsCAAAA7wICrAIAAADvAgitAgAAAO8CCLICAACLBO8CIgyiAgAAjAQAMKMCAADfAQAQpAIAAIwEADClAgEAvAMAIaYCAQC9AwAhpwIBAL0DACGoAiAAvgMAIakCQAC_AwAhqgJAAL8DACG_AgEA0QMAId0CAQC8AwAh8gIBAL0DACEMogIAAI0EADCjAgAAyQEAEKQCAACNBAAwpQIBALwDACGpAkAAvwMAIcMCAACPBPYCIsQCAQC8AwAh3AIBANEDACHzAgEAvAMAIfQCAgCOBAAh9gIBANEDACH3AkAAvwMAIQ0IAADBAwAgPAAAkwQAID0AAMEDACA-AADBAwAgPwAAwQMAIKsCAgAAAAGsAgIAAAAErQICAAAABK4CAgAAAAGvAgIAAAABsAICAAAAAbECAgAAAAGyAgIAkgQAIQcIAADBAwAgPgAAkQQAID8AAJEEACCrAgAAAPYCAqwCAAAA9gIIrQIAAAD2AgiyAgAAkAT2AiIHCAAAwQMAID4AAJEEACA_AACRBAAgqwIAAAD2AgKsAgAAAPYCCK0CAAAA9gIIsgIAAJAE9gIiBKsCAAAA9gICrAIAAAD2AgitAgAAAPYCCLICAACRBPYCIg0IAADBAwAgPAAAkwQAID0AAMEDACA-AADBAwAgPwAAwQMAIKsCAgAAAAGsAgIAAAAErQICAAAABK4CAgAAAAGvAgIAAAABsAICAAAAAbECAgAAAAGyAgIAkgQAIQirAggAAAABrAIIAAAABK0CCAAAAASuAggAAAABrwIIAAAAAbACCAAAAAGxAggAAAABsgIIAJMEACEHogIAAJQEADCjAgAAswEAEKQCAACUBAAwpQIBALwDACGpAkAAvwMAIaoCQAC_AwAh5wIBALwDACEKAgAAlgQAICYAAJcEACAnAACYBAAgogIAAJUEADCjAgAAAwAQpAIAAJUEADClAgEAyQMAIakCQADMAwAhqgJAAMwDACHnAgEAyQMAIRcBAADnAwAgEQAA6AMAIBwAAOwDACAjAADpAwAgJAAA6gMAICUAAOsDACCiAgAA4QMAMKMCAAAeABCkAgAA4QMAMKUCAQDJAwAhpgIBAMoDACGpAkAAzAMAIaoCQADMAwAhuQIBAMoDACG6AgEA4gMAIbsCAQDiAwAhvQIAAOMDvQIivgIgAOQDACG_AgEA4gMAIcECAADlA8ECIsMCAADmA8MCIokDAAAeACCKAwAAHgAgA7YCAABRACC3AgAAUQAguAIAAFEAIAO2AgAAFAAgtwIAABQAILgCAAAUACANogIAAJkEADCjAgAAmwEAEKQCAACZBAAwpQIBALwDACGpAkAAvwMAIaoCQAC_AwAhwwIAAJoE-gIixAIBALwDACHzAgEAvAMAIfgCAQDvAwAh-gJAAL8DACH7AkAA9gMAIfwCQAD2AwAhBwgAAMEDACA-AACcBAAgPwAAnAQAIKsCAAAA-gICrAIAAAD6AgitAgAAAPoCCLICAACbBPoCIgcIAADBAwAgPgAAnAQAID8AAJwEACCrAgAAAPoCAqwCAAAA-gIIrQIAAAD6AgiyAgAAmwT6AiIEqwIAAAD6AgKsAgAAAPoCCK0CAAAA-gIIsgIAAJwE-gIiC6ICAACdBAAwowIAAIMBABCkAgAAnQQAMKUCAQC8AwAhqQJAAL8DACGqAkAAvwMAIecCAQC8AwAh_QIBALwDACH-AgEAvQMAIf8CAQC9AwAhgQMAAJ4EgQMiBwgAAMEDACA-AACgBAAgPwAAoAQAIKsCAAAAgQMCrAIAAACBAwitAgAAAIEDCLICAACfBIEDIgcIAADBAwAgPgAAoAQAID8AAKAEACCrAgAAAIEDAqwCAAAAgQMIrQIAAACBAwiyAgAAnwSBAyIEqwIAAACBAwKsAgAAAIEDCK0CAAAAgQMIsgIAAKAEgQMiDqICAAChBAAwowIAAG0AEKQCAAChBAAwpQIBALwDACGpAkAAvwMAIaoCQAC_AwAhygIBALwDACGCAwEA0QMAIYMDAQC9AwAhhAMBAL0DACGFAwEAvQMAIYYDAQDRAwAhhwMQAKIEACGIAxAAogQAIQ0IAADbAwAgPAAApAQAID0AAKQEACA-AACkBAAgPwAApAQAIKsCEAAAAAGsAhAAAAAFrQIQAAAABa4CEAAAAAGvAhAAAAABsAIQAAAAAbECEAAAAAGyAhAAowQAIQ0IAADbAwAgPAAApAQAID0AAKQEACA-AACkBAAgPwAApAQAIKsCEAAAAAGsAhAAAAAFrQIQAAAABa4CEAAAAAGvAhAAAAABsAIQAAAAAbECEAAAAAGyAhAAowQAIQirAhAAAAABrAIQAAAABa0CEAAAAAWuAhAAAAABrwIQAAAAAbACEAAAAAGxAhAAAAABsgIQAKQEACERAQAApwQAICgAAJgEACApAACYBAAgogIAAKUEADCjAgAAUQAQpAIAAKUEADClAgEAyQMAIakCQADMAwAhqgJAAMwDACHKAgEAyQMAIYIDAQDiAwAhgwMBAMoDACGEAwEAygMAIYUDAQDKAwAhhgMBAOIDACGHAxAApgQAIYgDEACmBAAhCKsCEAAAAAGsAhAAAAAFrQIQAAAABa4CEAAAAAGvAhAAAAABsAIQAAAAAbECEAAAAAGyAhAApAQAIQwCAACWBAAgJgAAlwQAICcAAJgEACCiAgAAlQQAMKMCAAADABCkAgAAlQQAMKUCAQDJAwAhqQJAAMwDACGqAkAAzAMAIecCAQDJAwAhiQMAAAMAIIoDAAADACANAgAAlgQAIA4AAKoEACCiAgAAqAQAMKMCAAAzABCkAgAAqAQAMKUCAQDJAwAhqQJAAMwDACHEAgEAqQQAIecCAQDJAwAh6AIBAMoDACHpAgEAygMAIeoCAQDKAwAh6wIgAMsDACEIqwIBAAAAAawCAQAAAAWtAgEAAAAFrgIBAAAAAa8CAQAAAAGwAgEAAAABsQIBAAAAAbICAQCrBAAhIgEAAKcEACAKAAC6BAAgCwAAugQAIAwAALsEACANAAC7BAAgEAAA6QMAIBMAAOoDACAXAADrAwAgGQAAsAQAIBoAALwEACAbAAC9BAAgHAAA7AMAIKICAAC5BAAwowIAABQAEKQCAAC5BAAwpQIBAMkDACGpAkAAzAMAIaoCQADMAwAhwwIAALgExgIiyQIBAMoDACHKAgEAyQMAIcsCAQDJAwAhzAIBAMkDACHNAgEAqQQAIc4CAQCpBAAhzwIBAMoDACHQAhAAhAQAIdECAQDiAwAh0gIBAMoDACHTAhAAhAQAIdUCAACFBNUCItYCQACGBAAhiQMAABQAIIoDAAAUACAIqwIBAAAAAawCAQAAAAWtAgEAAAAFrgIBAAAAAa8CAQAAAAGwAgEAAAABsQIBAAAAAbICAQCrBAAhDw4AAP8DACARAACvBAAgGQAAsAQAIKICAACsBAAwowIAACoAEKQCAACsBAAwpQIBAMkDACGpAkAAzAMAIcMCAACuBPYCIsQCAQDJAwAh3AIBAOIDACHzAgEAyQMAIfQCAgCtBAAh9gIBAOIDACH3AkAAzAMAIQirAgIAAAABrAICAAAABK0CAgAAAASuAgIAAAABrwICAAAAAbACAgAAAAGxAgIAAAABsgICAMEDACEEqwIAAAD2AgKsAgAAAPYCCK0CAAAA9gIIsgIAAJEE9gIiEQIAAJYEACAaAAC8BAAgIQAAswQAICIAAOoDACCiAgAAvgQAMKMCAAAFABCkAgAAvgQAMKUCAQDJAwAhqQJAAMwDACGqAkAAzAMAIecCAQDJAwAh_QIBAMkDACH-AgEAygMAIf8CAQDKAwAhgQMAAL8EgQMiiQMAAAUAIIoDAAAFACAQDgAA_wMAIBgAAIAEACCiAgAA_gMAMKMCAAAuABCkAgAA_gMAMKUCAQDJAwAhqQJAAMwDACHEAgEAyQMAIdcCAQDJAwAh2AIBAMoDACHZAgEAygMAIdoCAQDiAwAh2wIBAOIDACHcAgEA4gMAIYkDAAAuACCKAwAALgAgEQ4AAP8DACAUAACzBAAgFQAAswQAIBYAALQEACCiAgAAsQQAMKMCAAAlABCkAgAAsQQAMKUCAQDJAwAhqQJAAMwDACGqAkAAzAMAIcMCAACyBO8CIsQCAQDJAwAh7AIBAMkDACHtAgEAyQMAIe8CQACGBAAh8AJAAIYEACHxAgEAqQQAIQSrAgAAAO8CAqwCAAAA7wIIrQIAAADvAgiyAgAAiwTvAiIUBgAAwQQAIAkAAMMEACAdAACYBAAgHgAAmAQAIB8AAOsDACAgAADrAwAgogIAAMIEADCjAgAABwAQpAIAAMIEADClAgEAyQMAIaYCAQDKAwAhpwIBAMoDACGoAiAAywMAIakCQADMAwAhqgJAAMwDACG_AgEA4gMAId0CAQDJAwAh8gIBAMoDACGJAwAABwAgigMAAAcAIBcBAADnAwAgEQAA6AMAIBwAAOwDACAjAADpAwAgJAAA6gMAICUAAOsDACCiAgAA4QMAMKMCAAAeABCkAgAA4QMAMKUCAQDJAwAhpgIBAMoDACGpAkAAzAMAIaoCQADMAwAhuQIBAMoDACG6AgEA4gMAIbsCAQDiAwAhvQIAAOMDvQIivgIgAOQDACG_AgEA4gMAIcECAADlA8ECIsMCAADmA8MCIokDAAAeACCKAwAAHgAgEA4AAP8DACARAACvBAAgEgAAtAQAIKICAAC1BAAwowIAACAAEKQCAAC1BAAwpQIBAMkDACGpAkAAzAMAIaoCQADMAwAhwwIAALYE-gIixAIBAMkDACHzAgEAyQMAIfgCAQCpBAAh-gJAAMwDACH7AkAAhgQAIfwCQACGBAAhBKsCAAAA-gICrAIAAAD6AgitAgAAAPoCCLICAACcBPoCIgwOAAD_AwAgDwAAtAQAIKICAAC3BAAwowIAABoAEKQCAAC3BAAwpQIBAMkDACGpAkAAzAMAIcMCAAC4BMYCIsQCAQDJAwAhxgIBAOIDACHHAgEA4gMAIcgCAQCpBAAhBKsCAAAAxgICrAIAAADGAgitAgAAAMYCCLICAADyA8YCIiABAACnBAAgCgAAugQAIAsAALoEACAMAAC7BAAgDQAAuwQAIBAAAOkDACATAADqAwAgFwAA6wMAIBkAALAEACAaAAC8BAAgGwAAvQQAIBwAAOwDACCiAgAAuQQAMKMCAAAUABCkAgAAuQQAMKUCAQDJAwAhqQJAAMwDACGqAkAAzAMAIcMCAAC4BMYCIskCAQDKAwAhygIBAMkDACHLAgEAyQMAIcwCAQDJAwAhzQIBAKkEACHOAgEAqQQAIc8CAQDKAwAh0AIQAIQEACHRAgEA4gMAIdICAQDKAwAh0wIQAIQEACHVAgAAhQTVAiLWAkAAhgQAIRMBAACnBAAgKAAAmAQAICkAAJgEACCiAgAApQQAMKMCAABRABCkAgAApQQAMKUCAQDJAwAhqQJAAMwDACGqAkAAzAMAIcoCAQDJAwAhggMBAOIDACGDAwEAygMAIYQDAQDKAwAhhQMBAMoDACGGAwEA4gMAIYcDEACmBAAhiAMQAKYEACGJAwAAUQAgigMAAFEAIBQGAADBBAAgCQAAwwQAIB0AAJgEACAeAACYBAAgHwAA6wMAICAAAOsDACCiAgAAwgQAMKMCAAAHABCkAgAAwgQAMKUCAQDJAwAhpgIBAMoDACGnAgEAygMAIagCIADLAwAhqQJAAMwDACGqAkAAzAMAIb8CAQDiAwAh3QIBAMkDACHyAgEAygMAIYkDAAAHACCKAwAABwAgA7YCAAAqACC3AgAAKgAguAIAACoAIBAOAAD_AwAgogIAAIMEADCjAgAAMQAQpAIAAIMEADClAgEAyQMAIakCQADMAwAhqgJAAMwDACHDAgAAhQTVAiLEAgEAyQMAIeICEACEBAAh4wIBAMoDACHkAgEAygMAIeUCAQDiAwAh5gJAAIYEACGJAwAAMQAgigMAADEAIA8CAACWBAAgGgAAvAQAICEAALMEACAiAADqAwAgogIAAL4EADCjAgAABQAQpAIAAL4EADClAgEAyQMAIakCQADMAwAhqgJAAMwDACHnAgEAyQMAIf0CAQDJAwAh_gIBAMoDACH_AgEAygMAIYEDAAC_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_AgEA4gMAId0CAQDJAwAh8gIBAMoDACECAAAACQAgLwAA5AQAIAIAAADhBAAgLwAA4gQAIAyiAgAA4AQAMKMCAADhBAAQpAIAAOAEADClAgEAyQMAIaYCAQDKAwAhpwIBAMoDACGoAiAAywMAIakCQADMAwAhqgJAAMwDACG_AgEA4gMAId0CAQDJAwAh8gIBAMoDACEMogIAAOAEADCjAgAA4QQAEKQCAADgBAAwpQIBAMkDACGmAgEAygMAIacCAQDKAwAhqAIgAMsDACGpAkAAzAMAIaoCQADMAwAhvwIBAOIDACHdAgEAyQMAIfICAQDKAwAhCKUCAQDHBAAhpgIBAMcEACGnAgEAxwQAIagCIADIBAAhqQJAAMkEACGqAkAAyQQAIb8CAQDjBAAh8gIBAMcEACEBjgMBAAAAAQ0JAADlBAAgHQAA5gQAIB4AAOcEACAfAADoBAAgIAAA6QQAIKUCAQDHBAAhpgIBAMcEACGnAgEAxwQAIagCIADIBAAhqQJAAMkEACGqAkAAyQQAIb8CAQDjBAAh8gIBAMcEACELNgAAkwYAMDcAAJgGADCLAwAAlAYAMIwDAACVBgAwjQMAAJYGACCOAwAAlwYAMI8DAACXBgAwkAMAAJcGADCRAwAAlwYAMJIDAACZBgAwkwMAAJoGADALNgAAiAYAMDcAAIwGADCLAwAAiQYAMIwDAACKBgAwjQMAAIsGACCOAwAAjQUAMI8DAACNBQAwkAMAAI0FADCRAwAAjQUAMJIDAACNBgAwkwMAAJAFADALNgAAiQUAMDcAAI4FADCLAwAAigUAMIwDAACLBQAwjQMAAIwFACCOAwAAjQUAMI8DAACNBQAwkAMAAI0FADCRAwAAjQUAMJIDAACPBQAwkwMAAJAFADALNgAA_gQAMDcAAIIFADCLAwAA_wQAMIwDAACABQAwjQMAAIEFACCOAwAA7gQAMI8DAADuBAAwkAMAAO4EADCRAwAA7gQAMJIDAACDBQAwkwMAAPEEADALNgAA6gQAMDcAAO8EADCLAwAA6wQAMIwDAADsBAAwjQMAAO0EACCOAwAA7gQAMI8DAADuBAAwkAMAAO4EADCRAwAA7gQAMJIDAADwBAAwkwMAAPEEADAMDgAA-wQAIBQAAPwEACAWAAD9BAAgpQIBAAAAAakCQAAAAAGqAkAAAAABwwIAAADvAgLEAgEAAAAB7AIBAAAAAe8CQAAAAAHwAkAAAAAB8QIBAAAAAQIAAAAnACA2AAD6BAAgAwAAACcAIDYAAPoEACA3AAD2BAAgAS8AAKUJADARDgAA_wMAIBQAALMEACAVAACzBAAgFgAAtAQAIKICAACxBAAwowIAACUAEKQCAACxBAAwpQIBAAAAAakCQADMAwAhqgJAAMwDACHDAgAAsgTvAiLEAgEAyQMAIewCAQDJAwAh7QIBAMkDACHvAkAAhgQAIfACQACGBAAh8QIBAKkEACECAAAAJwAgLwAA9gQAIAIAAADyBAAgLwAA8wQAIA2iAgAA8QQAMKMCAADyBAAQpAIAAPEEADClAgEAyQMAIakCQADMAwAhqgJAAMwDACHDAgAAsgTvAiLEAgEAyQMAIewCAQDJAwAh7QIBAMkDACHvAkAAhgQAIfACQACGBAAh8QIBAKkEACENogIAAPEEADCjAgAA8gQAEKQCAADxBAAwpQIBAMkDACGpAkAAzAMAIaoCQADMAwAhwwIAALIE7wIixAIBAMkDACHsAgEAyQMAIe0CAQDJAwAh7wJAAIYEACHwAkAAhgQAIfECAQCpBAAhCaUCAQDHBAAhqQJAAMkEACGqAkAAyQQAIcMCAAD0BO8CIsQCAQDHBAAh7AIBAMcEACHvAkAA9QQAIfACQAD1BAAh8QIBAOMEACEBjgMAAADvAgIBjgNAAAAAAQwOAAD3BAAgFAAA-AQAIBYAAPkEACClAgEAxwQAIakCQADJBAAhqgJAAMkEACHDAgAA9ATvAiLEAgEAxwQAIewCAQDHBAAh7wJAAPUEACHwAkAA9QQAIfECAQDjBAAhBTYAAJoJACA3AACjCQAgiwMAAJsJACCMAwAAogkAIJEDAAAWACAFNgAAmAkAIDcAAKAJACCLAwAAmQkAIIwDAACfCQAgkQMAAAkAIAc2AACWCQAgNwAAnQkAIIsDAACXCQAgjAMAAJwJACCPAwAAHgAgkAMAAB4AIJEDAACKAwAgDA4AAPsEACAUAAD8BAAgFgAA_QQAIKUCAQAAAAGpAkAAAAABqgJAAAAAAcMCAAAA7wICxAIBAAAAAewCAQAAAAHvAkAAAAAB8AJAAAAAAfECAQAAAAEDNgAAmgkAIIsDAACbCQAgkQMAABYAIAM2AACYCQAgiwMAAJkJACCRAwAACQAgAzYAAJYJACCLAwAAlwkAIJEDAACKAwAgDA4AAPsEACAVAACIBQAgFgAA_QQAIKUCAQAAAAGpAkAAAAABqgJAAAAAAcMCAAAA7wICxAIBAAAAAe0CAQAAAAHvAkAAAAAB8AJAAAAAAfECAQAAAAECAAAAJwAgNgAAhwUAIAMAAAAnACA2AACHBQAgNwAAhQUAIAEvAACVCQAwAgAAACcAIC8AAIUFACACAAAA8gQAIC8AAIQFACAJpQIBAMcEACGpAkAAyQQAIaoCQADJBAAhwwIAAPQE7wIixAIBAMcEACHtAgEAxwQAIe8CQAD1BAAh8AJAAPUEACHxAgEA4wQAIQwOAAD3BAAgFQAAhgUAIBYAAPkEACClAgEAxwQAIakCQADJBAAhqgJAAMkEACHDAgAA9ATvAiLEAgEAxwQAIe0CAQDHBAAh7wJAAPUEACHwAkAA9QQAIfECAQDjBAAhBTYAAJAJACA3AACTCQAgiwMAAJEJACCMAwAAkgkAIJEDAAAJACAMDgAA-wQAIBUAAIgFACAWAAD9BAAgpQIBAAAAAakCQAAAAAGqAkAAAAABwwIAAADvAgLEAgEAAAAB7QIBAAAAAe8CQAAAAAHwAkAAAAAB8QIBAAAAAQM2AACQCQAgiwMAAJEJACCRAwAACQAgGwEAAP0FACAKAAD-BQAgCwAA_wUAIAwAAIAGACAQAACBBgAgEwAAggYAIBcAAIMGACAZAACFBgAgGgAAhAYAIBsAAIYGACAcAACHBgAgpQIBAAAAAakCQAAAAAGqAkAAAAABwwIAAADGAgLJAgEAAAABygIBAAAAAcsCAQAAAAHMAgEAAAABzQIBAAAAAc8CAQAAAAHQAhAAAAAB0QIBAAAAAdICAQAAAAHTAhAAAAAB1QIAAADVAgLWAkAAAAABAgAAABYAIDYAAPwFACADAAAAFgAgNgAA_AUAIDcAAJUFACABLwAAjwkAMCABAACnBAAgCgAAugQAIAsAALoEACAMAAC7BAAgDQAAuwQAIBAAAOkDACATAADqAwAgFwAA6wMAIBkAALAEACAaAAC8BAAgGwAAvQQAIBwAAOwDACCiAgAAuQQAMKMCAAAUABCkAgAAuQQAMKUCAQAAAAGpAkAAzAMAIaoCQADMAwAhwwIAALgExgIiyQIBAAAAAcoCAQDJAwAhywIBAMkDACHMAgEAyQMAIc0CAQCpBAAhzgIBAKkEACHPAgEAygMAIdACEACEBAAh0QIBAOIDACHSAgEAygMAIdMCEACEBAAh1QIAAIUE1QIi1gJAAIYEACECAAAAFgAgLwAAlQUAIAIAAACRBQAgLwAAkgUAIBSiAgAAkAUAMKMCAACRBQAQpAIAAJAFADClAgEAyQMAIakCQADMAwAhqgJAAMwDACHDAgAAuATGAiLJAgEAygMAIcoCAQDJAwAhywIBAMkDACHMAgEAyQMAIc0CAQCpBAAhzgIBAKkEACHPAgEAygMAIdACEACEBAAh0QIBAOIDACHSAgEAygMAIdMCEACEBAAh1QIAAIUE1QIi1gJAAIYEACEUogIAAJAFADCjAgAAkQUAEKQCAACQBQAwpQIBAMkDACGpAkAAzAMAIaoCQADMAwAhwwIAALgExgIiyQIBAMoDACHKAgEAyQMAIcsCAQDJAwAhzAIBAMkDACHNAgEAqQQAIc4CAQCpBAAhzwIBAMoDACHQAhAAhAQAIdECAQDiAwAh0gIBAMoDACHTAhAAhAQAIdUCAACFBNUCItYCQACGBAAhEKUCAQDHBAAhqQJAAMkEACGqAkAAyQQAIcMCAACTBcYCIskCAQDHBAAhygIBAMcEACHLAgEAxwQAIcwCAQDHBAAhzQIBAOMEACHPAgEAxwQAIdACEADWBAAh0QIBAOMEACHSAgEAxwQAIdMCEADWBAAh1QIAAJQF1QIi1gJAAPUEACEBjgMAAADGAgIBjgMAAADVAgIbAQAAlgUAIAoAAJcFACALAACYBQAgDAAAmQUAIBAAAJoFACATAACbBQAgFwAAnAUAIBkAAJ4FACAaAACdBQAgGwAAnwUAIBwAAKAFACClAgEAxwQAIakCQADJBAAhqgJAAMkEACHDAgAAkwXGAiLJAgEAxwQAIcoCAQDHBAAhywIBAMcEACHMAgEAxwQAIc0CAQDjBAAhzwIBAMcEACHQAhAA1gQAIdECAQDjBAAh0gIBAMcEACHTAhAA1gQAIdUCAACUBdUCItYCQAD1BAAhBTYAANkIACA3AACNCQAgiwMAANoIACCMAwAAjAkAIJEDAACeAQAgBTYAANcIACA3AACKCQAgiwMAANgIACCMAwAAiQkAIJEDAAABACAFNgAA1QgAIDcAAIcJACCLAwAA1ggAIIwDAACGCQAgkQMAAAEAIAc2AADTCAAgNwAAhAkAIIsDAADUCAAgjAMAAIMJACCPAwAABwAgkAMAAAcAIJEDAAAJACALNgAA7gUAMDcAAPMFADCLAwAA7wUAMIwDAADwBQAwjQMAAPEFACCOAwAA8gUAMI8DAADyBQAwkAMAAPIFADCRAwAA8gUAMJIDAAD0BQAwkwMAAPUFADALNgAA3QUAMDcAAOIFADCLAwAA3gUAMIwDAADfBQAwjQMAAOAFACCOAwAA4QUAMI8DAADhBQAwkAMAAOEFADCRAwAA4QUAMJIDAADjBQAwkwMAAOQFADALNgAA1AUAMDcAANgFADCLAwAA1QUAMIwDAADWBQAwjQMAANcFACCOAwAA7gQAMI8DAADuBAAwkAMAAO4EADCRAwAA7gQAMJIDAADZBQAwkwMAAPEEADALNgAAuwUAMDcAAMAFADCLAwAAvAUAMIwDAAC9BQAwjQMAAL4FACCOAwAAvwUAMI8DAAC_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_AQAIBUAAIgFACAWAAD9BAAgpQIBAAAAAakCQAAAAAGqAkAAAAABwwIAAADvAgLsAgEAAAAB7QIBAAAAAe8CQAAAAAHwAkAAAAAB8QIBAAAAAQIAAAAnACA2AADcBQAgAwAAACcAIDYAANwFACA3AADbBQAgAS8AAOwIADACAAAAJwAgLwAA2wUAIAIAAADyBAAgLwAA2gUAIAmlAgEAxwQAIakCQADJBAAhqgJAAMkEACHDAgAA9ATvAiLsAgEAxwQAIe0CAQDHBAAh7wJAAPUEACHwAkAA9QQAIfECAQDjBAAhDBQAAPgEACAVAACGBQAgFgAA-QQAIKUCAQDHBAAhqQJAAMkEACGqAkAAyQQAIcMCAAD0BO8CIuwCAQDHBAAh7QIBAMcEACHvAkAA9QQAIfACQAD1BAAh8QIBAOMEACEMFAAA_AQAIBUAAIgFACAWAAD9BAAgpQIBAAAAAakCQAAAAAGqAkAAAAABwwIAAADvAgLsAgEAAAAB7QIBAAAAAe8CQAAAAAHwAkAAAAAB8QIBAAAAAQsRAADsBQAgEgAA7QUAIKUCAQAAAAGpAkAAAAABqgJAAAAAAcMCAAAA-gIC8wIBAAAAAfgCAQAAAAH6AkAAAAAB-wJAAAAAAfwCQAAAAAECAAAAIgAgNgAA6wUAIAMAAAAiACA2AADrBQAgNwAA6AUAIAEvAADrCAAwEA4AAP8DACARAACvBAAgEgAAtAQAIKICAAC1BAAwowIAACAAEKQCAAC1BAAwpQIBAAAAAakCQADMAwAhqgJAAMwDACHDAgAAtgT6AiLEAgEAyQMAIfMCAQDJAwAh-AIBAKkEACH6AkAAzAMAIfsCQACGBAAh_AJAAIYEACECAAAAIgAgLwAA6AUAIAIAAADlBQAgLwAA5gUAIA2iAgAA5AUAMKMCAADlBQAQpAIAAOQFADClAgEAyQMAIakCQADMAwAhqgJAAMwDACHDAgAAtgT6AiLEAgEAyQMAIfMCAQDJAwAh-AIBAKkEACH6AkAAzAMAIfsCQACGBAAh_AJAAIYEACENogIAAOQFADCjAgAA5QUAEKQCAADkBQAwpQIBAMkDACGpAkAAzAMAIaoCQADMAwAhwwIAALYE-gIixAIBAMkDACHzAgEAyQMAIfgCAQCpBAAh-gJAAMwDACH7AkAAhgQAIfwCQACGBAAhCaUCAQDHBAAhqQJAAMkEACGqAkAAyQQAIcMCAADnBfoCIvMCAQDHBAAh-AIBAOMEACH6AkAAyQQAIfsCQAD1BAAh_AJAAPUEACEBjgMAAAD6AgILEQAA6QUAIBIAAOoFACClAgEAxwQAIakCQADJBAAhqgJAAMkEACHDAgAA5wX6AiLzAgEAxwQAIfgCAQDjBAAh-gJAAMkEACH7AkAA9QQAIfwCQAD1BAAhBTYAAOMIACA3AADpCAAgiwMAAOQIACCMAwAA6AgAIJEDAAASACAHNgAA4QgAIDcAAOYIACCLAwAA4ggAIIwDAADlCAAgjwMAAB4AIJADAAAeACCRAwAAigMAIAsRAADsBQAgEgAA7QUAIKUCAQAAAAGpAkAAAAABqgJAAAAAAcMCAAAA-gIC8wIBAAAAAfgCAQAAAAH6AkAAAAAB-wJAAAAAAfwCQAAAAAEDNgAA4wgAIIsDAADkCAAgkQMAABIAIAM2AADhCAAgiwMAAOIIACCRAwAAigMAIAcPAAD7BQAgpQIBAAAAAakCQAAAAAHDAgAAAMYCAsYCAQAAAAHHAgEAAAAByAIBAAAAAQIAAAAcACA2AAD6BQAgAwAAABwAIDYAAPoFACA3AAD4BQAgAS8AAOAIADAMDgAA_wMAIA8AALQEACCiAgAAtwQAMKMCAAAaABCkAgAAtwQAMKUCAQAAAAGpAkAAzAMAIcMCAAC4BMYCIsQCAQDJAwAhxgIBAOIDACHHAgEA4gMAIcgCAQCpBAAhAgAAABwAIC8AAPgFACACAAAA9gUAIC8AAPcFACAKogIAAPUFADCjAgAA9gUAEKQCAAD1BQAwpQIBAMkDACGpAkAAzAMAIcMCAAC4BMYCIsQCAQDJAwAhxgIBAOIDACHHAgEA4gMAIcgCAQCpBAAhCqICAAD1BQAwowIAAPYFABCkAgAA9QUAMKUCAQDJAwAhqQJAAMwDACHDAgAAuATGAiLEAgEAyQMAIcYCAQDiAwAhxwIBAOIDACHIAgEAqQQAIQalAgEAxwQAIakCQADJBAAhwwIAAJMFxgIixgIBAOMEACHHAgEA4wQAIcgCAQDjBAAhBw8AAPkFACClAgEAxwQAIakCQADJBAAhwwIAAJMFxgIixgIBAOMEACHHAgEA4wQAIcgCAQDjBAAhBzYAANsIACA3AADeCAAgiwMAANwIACCMAwAA3QgAII8DAAAeACCQAwAAHgAgkQMAAIoDACAHDwAA-wUAIKUCAQAAAAGpAkAAAAABwwIAAADGAgLGAgEAAAABxwIBAAAAAcgCAQAAAAEDNgAA2wgAIIsDAADcCAAgkQMAAIoDACAbAQAA_QUAIAoAAP4FACALAAD_BQAgDAAAgAYAIBAAAIEGACATAACCBgAgFwAAgwYAIBkAAIUGACAaAACEBgAgGwAAhgYAIBwAAIcGACClAgEAAAABqQJAAAAAAaoCQAAAAAHDAgAAAMYCAskCAQAAAAHKAgEAAAABywIBAAAAAcwCAQAAAAHNAgEAAAABzwIBAAAAAdACEAAAAAHRAgEAAAAB0gIBAAAAAdMCEAAAAAHVAgAAANUCAtYCQAAAAAEDNgAA2QgAIIsDAADaCAAgkQMAAJ4BACADNgAA1wgAIIsDAADYCAAgkQMAAAEAIAM2AADVCAAgiwMAANYIACCRAwAAAQAgAzYAANMIACCLAwAA1AgAIJEDAAAJACAENgAA7gUAMIsDAADvBQAwjQMAAPEFACCRAwAA8gUAMAQ2AADdBQAwiwMAAN4FADCNAwAA4AUAIJEDAADhBQAwBDYAANQFADCLAwAA1QUAMI0DAADXBQAgkQMAAO4EADAENgAAuwUAMIsDAAC8BQAwjQMAAL4FACCRAwAAvwUAMAM2AAC0BQAgiwMAALUFACCRAwAAwAIAIAM2AACvBQAgiwMAALAFACCRAwAAkgIAIAQ2AAChBQAwiwMAAKIFADCNAwAApAUAIJEDAAClBQAwGwEAAP0FACAKAAD-BQAgCwAA_wUAIA0AAJIGACAQAACBBgAgEwAAggYAIBcAAIMGACAZAACFBgAgGgAAhAYAIBsAAIYGACAcAACHBgAgpQIBAAAAAakCQAAAAAGqAkAAAAABwwIAAADGAgLJAgEAAAABygIBAAAAAcsCAQAAAAHMAgEAAAABzgIBAAAAAc8CAQAAAAHQAhAAAAAB0QIBAAAAAdICAQAAAAHTAhAAAAAB1QIAAADVAgLWAkAAAAABAgAAABYAIDYAAJEGACADAAAAFgAgNgAAkQYAIDcAAI8GACABLwAA0ggAMAIAAAAWACAvAACPBgAgAgAAAJEFACAvAACOBgAgEKUCAQDHBAAhqQJAAMkEACGqAkAAyQQAIcMCAACTBcYCIskCAQDHBAAhygIBAMcEACHLAgEAxwQAIcwCAQDHBAAhzgIBAOMEACHPAgEAxwQAIdACEADWBAAh0QIBAOMEACHSAgEAxwQAIdMCEADWBAAh1QIAAJQF1QIi1gJAAPUEACEbAQAAlgUAIAoAAJcFACALAACYBQAgDQAAkAYAIBAAAJoFACATAACbBQAgFwAAnAUAIBkAAJ4FACAaAACdBQAgGwAAnwUAIBwAAKAFACClAgEAxwQAIakCQADJBAAhqgJAAMkEACHDAgAAkwXGAiLJAgEAxwQAIcoCAQDHBAAhywIBAMcEACHMAgEAxwQAIc4CAQDjBAAhzwIBAMcEACHQAhAA1gQAIdECAQDjBAAh0gIBAMcEACHTAhAA1gQAIdUCAACUBdUCItYCQAD1BAAhBzYAAM0IACA3AADQCAAgiwMAAM4IACCMAwAAzwgAII8DAAAHACCQAwAABwAgkQMAAAkAIBsBAAD9BQAgCgAA_gUAIAsAAP8FACANAACSBgAgEAAAgQYAIBMAAIIGACAXAACDBgAgGQAAhQYAIBoAAIQGACAbAACGBgAgHAAAhwYAIKUCAQAAAAGpAkAAAAABqgJAAAAAAcMCAAAAxgICyQIBAAAAAcoCAQAAAAHLAgEAAAABzAIBAAAAAc4CAQAAAAHPAgEAAAAB0AIQAAAAAdECAQAAAAHSAgEAAAAB0wIQAAAAAdUCAAAA1QIC1gJAAAAAAQM2AADNCAAgiwMAAM4IACCRAwAACQAgCgIAALkGACAaAAC7BgAgIgAAugYAIKUCAQAAAAGpAkAAAAABqgJAAAAAAecCAQAAAAH-AgEAAAAB_wIBAAAAAYEDAAAAgQMCAgAAABIAIDYAALgGACADAAAAEgAgNgAAuAYAIDcAAJ4GACABLwAAzAgAMA8CAACWBAAgGgAAvAQAICEAALMEACAiAADqAwAgogIAAL4EADCjAgAABQAQpAIAAL4EADClAgEAAAABqQJAAMwDACGqAkAAzAMAIecCAQAAAAH9AgEAyQMAIf4CAQDKAwAh_wIBAMoDACGBAwAAvwSBAyICAAAAEgAgLwAAngYAIAIAAACbBgAgLwAAnAYAIAuiAgAAmgYAMKMCAACbBgAQpAIAAJoGADClAgEAyQMAIakCQADMAwAhqgJAAMwDACHnAgEAyQMAIf0CAQDJAwAh_gIBAMoDACH_AgEAygMAIYEDAAC_BIEDIguiAgAAmgYAMKMCAACbBgAQpAIAAJoGADClAgEAyQMAIakCQADMAwAhqgJAAMwDACHnAgEAyQMAIf0CAQDJAwAh_gIBAMoDACH_AgEAygMAIYEDAAC_BIEDIgelAgEAxwQAIakCQADJBAAhqgJAAMkEACHnAgEAxwQAIf4CAQDHBAAh_wIBAMcEACGBAwAAnQaBAyIBjgMAAACBAwIKAgAAnwYAIBoAAKEGACAiAACgBgAgpQIBAMcEACGpAkAAyQQAIaoCQADJBAAh5wIBAMcEACH-AgEAxwQAIf8CAQDHBAAhgQMAAJ0GgQMiBTYAALsIACA3AADKCAAgiwMAALwIACCMAwAAyQgAIJEDAACKAwAgCzYAAK0GADA3AACxBgAwiwMAAK4GADCMAwAArwYAMI0DAACwBgAgjgMAAOEFADCPAwAA4QUAMJADAADhBQAwkQMAAOEFADCSAwAAsgYAMJMDAADkBQAwCzYAAKIGADA3AACmBgAwiwMAAKMGADCMAwAApAYAMI0DAAClBgAgjgMAAL8FADCPAwAAvwUAMJADAAC_BQAwkQMAAL8FADCSAwAApwYAMJMDAADCBQAwCg4AAKwGACAZAADTBQAgpQIBAAAAAakCQAAAAAHDAgAAAPYCAsQCAQAAAAHcAgEAAAAB9AICAAAAAfYCAQAAAAH3AkAAAAABAgAAACwAIDYAAKsGACADAAAALAAgNgAAqwYAIDcAAKkGACABLwAAyAgAMAIAAAAsACAvAACpBgAgAgAAAMMFACAvAACoBgAgCKUCAQDHBAAhqQJAAMkEACHDAgAAxgX2AiLEAgEAxwQAIdwCAQDjBAAh9AICAMUFACH2AgEA4wQAIfcCQADJBAAhCg4AAKoGACAZAADJBQAgpQIBAMcEACGpAkAAyQQAIcMCAADGBfYCIsQCAQDHBAAh3AIBAOMEACH0AgIAxQUAIfYCAQDjBAAh9wJAAMkEACEFNgAAwwgAIDcAAMYIACCLAwAAxAgAIIwDAADFCAAgkQMAABYAIAoOAACsBgAgGQAA0wUAIKUCAQAAAAGpAkAAAAABwwIAAAD2AgLEAgEAAAAB3AIBAAAAAfQCAgAAAAH2AgEAAAAB9wJAAAAAAQM2AADDCAAgiwMAAMQIACCRAwAAFgAgCw4AALcGACASAADtBQAgpQIBAAAAAakCQAAAAAGqAkAAAAABwwIAAAD6AgLEAgEAAAAB-AIBAAAAAfoCQAAAAAH7AkAAAAAB_AJAAAAAAQIAAAAiACA2AAC2BgAgAwAAACIAIDYAALYGACA3AAC0BgAgAS8AAMIIADACAAAAIgAgLwAAtAYAIAIAAADlBQAgLwAAswYAIAmlAgEAxwQAIakCQADJBAAhqgJAAMkEACHDAgAA5wX6AiLEAgEAxwQAIfgCAQDjBAAh-gJAAMkEACH7AkAA9QQAIfwCQAD1BAAhCw4AALUGACASAADqBQAgpQIBAMcEACGpAkAAyQQAIaoCQADJBAAhwwIAAOcF-gIixAIBAMcEACH4AgEA4wQAIfoCQADJBAAh-wJAAPUEACH8AkAA9QQAIQU2AAC9CAAgNwAAwAgAIIsDAAC-CAAgjAMAAL8IACCRAwAAFgAgCw4AALcGACASAADtBQAgpQIBAAAAAakCQAAAAAGqAkAAAAABwwIAAAD6AgLEAgEAAAAB-AIBAAAAAfoCQAAAAAH7AkAAAAAB_AJAAAAAAQM2AAC9CAAgiwMAAL4IACCRAwAAFgAgCgIAALkGACAaAAC7BgAgIgAAugYAIKUCAQAAAAGpAkAAAAABqgJAAAAAAecCAQAAAAH-AgEAAAAB_wIBAAAAAYEDAAAAgQMCAzYAALsIACCLAwAAvAgAIJEDAACKAwAgBDYAAK0GADCLAwAArgYAMI0DAACwBgAgkQMAAOEFADAENgAAogYAMIsDAACjBgAwjQMAAKUGACCRAwAAvwUAMA0JAAC9BgAgHQAAvgYAIB4AAL8GACAfAADABgAgIAAAwQYAIKUCAQAAAAGmAgEAAAABpwIBAAAAAagCIAAAAAGpAkAAAAABqgJAAAAAAb8CAQAAAAHyAgEAAAABBDYAAJMGADCLAwAAlAYAMI0DAACWBgAgkQMAAJcGADAENgAAiAYAMIsDAACJBgAwjQMAAIsGACCRAwAAjQUAMAQ2AACJBQAwiwMAAIoFADCNAwAAjAUAIJEDAACNBQAwBDYAAP4EADCLAwAA_wQAMI0DAACBBQAgkQMAAO4EADAENgAA6gQAMIsDAADrBAAwjQMAAO0EACCRAwAA7gQAMAQ2AADZBAAwiwMAANoEADCNAwAA3AQAIJEDAADdBAAwBDYAAMwEADCLAwAAzQQAMI0DAADPBAAgkQMAANAEADAAAAAAAAABjgMAAAC9AgIBjgMgAAAAAQGOAwAAAMECAgGOAwAAAMMCAgc2AACDBwAgNwAAhgcAIIsDAACEBwAgjAMAAIUHACCPAwAAAwAgkAMAAAMAIJEDAACeAQAgBzYAAPwGACA3AAD_BgAgiwMAAP0GACCMAwAA_gYAII8DAAAFACCQAwAABQAgkQMAABIAIAs2AADxBgAwNwAA9QYAMIsDAADyBgAwjAMAAPMGADCNAwAA9AYAII4DAADyBQAwjwMAAPIFADCQAwAA8gUAMJEDAADyBQAwkgMAAPYGADCTAwAA9QUAMAs2AADoBgAwNwAA7AYAMIsDAADpBgAwjAMAAOoGADCNAwAA6wYAII4DAADhBQAwjwMAAOEFADCQAwAA4QUAMJEDAADhBQAwkgMAAO0GADCTAwAA5AUAMAs2AADfBgAwNwAA4wYAMIsDAADgBgAwjAMAAOEGADCNAwAA4gYAII4DAADuBAAwjwMAAO4EADCQAwAA7gQAMJEDAADuBAAwkgMAAOQGADCTAwAA8QQAMAs2AADUBgAwNwAA2AYAMIsDAADVBgAwjAMAANYGADCNAwAA1wYAII4DAAClBQAwjwMAAKUFADCQAwAApQUAMJEDAAClBQAwkgMAANkGADCTAwAAqAUAMAgOAADeBgAgpQIBAAAAAakCQAAAAAHEAgEAAAAB6AIBAAAAAekCAQAAAAHqAgEAAAAB6wIgAAAAAQIAAAA1ACA2AADdBgAgAwAAADUAIDYAAN0GACA3AADbBgAgAS8AALoIADACAAAANQAgLwAA2wYAIAIAAACpBQAgLwAA2gYAIAelAgEAxwQAIakCQADJBAAhxAIBAOMEACHoAgEAxwQAIekCAQDHBAAh6gIBAMcEACHrAiAAyAQAIQgOAADcBgAgpQIBAMcEACGpAkAAyQQAIcQCAQDjBAAh6AIBAMcEACHpAgEAxwQAIeoCAQDHBAAh6wIgAMgEACEHNgAAtQgAIDcAALgIACCLAwAAtggAIIwDAAC3CAAgjwMAABQAIJADAAAUACCRAwAAFgAgCA4AAN4GACClAgEAAAABqQJAAAAAAcQCAQAAAAHoAgEAAAAB6QIBAAAAAeoCAQAAAAHrAiAAAAABAzYAALUIACCLAwAAtggAIJEDAAAWACAMDgAA-wQAIBQAAPwEACAVAACIBQAgpQIBAAAAAakCQAAAAAGqAkAAAAABwwIAAADvAgLEAgEAAAAB7AIBAAAAAe0CAQAAAAHvAkAAAAAB8AJAAAAAAQIAAAAnACA2AADnBgAgAwAAACcAIDYAAOcGACA3AADmBgAgAS8AALQIADACAAAAJwAgLwAA5gYAIAIAAADyBAAgLwAA5QYAIAmlAgEAxwQAIakCQADJBAAhqgJAAMkEACHDAgAA9ATvAiLEAgEAxwQAIewCAQDHBAAh7QIBAMcEACHvAkAA9QQAIfACQAD1BAAhDA4AAPcEACAUAAD4BAAgFQAAhgUAIKUCAQDHBAAhqQJAAMkEACGqAkAAyQQAIcMCAAD0BO8CIsQCAQDHBAAh7AIBAMcEACHtAgEAxwQAIe8CQAD1BAAh8AJAAPUEACEMDgAA-wQAIBQAAPwEACAVAACIBQAgpQIBAAAAAakCQAAAAAGqAkAAAAABwwIAAADvAgLEAgEAAAAB7AIBAAAAAe0CAQAAAAHvAkAAAAAB8AJAAAAAAQsOAAC3BgAgEQAA7AUAIKUCAQAAAAGpAkAAAAABqgJAAAAAAcMCAAAA-gICxAIBAAAAAfMCAQAAAAH6AkAAAAAB-wJAAAAAAfwCQAAAAAECAAAAIgAgNgAA8AYAIAMAAAAiACA2AADwBgAgNwAA7wYAIAEvAACzCAAwAgAAACIAIC8AAO8GACACAAAA5QUAIC8AAO4GACAJpQIBAMcEACGpAkAAyQQAIaoCQADJBAAhwwIAAOcF-gIixAIBAMcEACHzAgEAxwQAIfoCQADJBAAh-wJAAPUEACH8AkAA9QQAIQsOAAC1BgAgEQAA6QUAIKUCAQDHBAAhqQJAAMkEACGqAkAAyQQAIcMCAADnBfoCIsQCAQDHBAAh8wIBAMcEACH6AkAAyQQAIfsCQAD1BAAh_AJAAPUEACELDgAAtwYAIBEAAOwFACClAgEAAAABqQJAAAAAAaoCQAAAAAHDAgAAAPoCAsQCAQAAAAHzAgEAAAAB-gJAAAAAAfsCQAAAAAH8AkAAAAABBw4AAPsGACClAgEAAAABqQJAAAAAAcMCAAAAxgICxAIBAAAAAcYCAQAAAAHHAgEAAAABAgAAABwAIDYAAPoGACADAAAAHAAgNgAA-gYAIDcAAPgGACABLwAAsggAMAIAAAAcACAvAAD4BgAgAgAAAPYFACAvAAD3BgAgBqUCAQDHBAAhqQJAAMkEACHDAgAAkwXGAiLEAgEAxwQAIcYCAQDjBAAhxwIBAOMEACEHDgAA-QYAIKUCAQDHBAAhqQJAAMkEACHDAgAAkwXGAiLEAgEAxwQAIcYCAQDjBAAhxwIBAOMEACEFNgAArQgAIDcAALAIACCLAwAArggAIIwDAACvCAAgkQMAABYAIAcOAAD7BgAgpQIBAAAAAakCQAAAAAHDAgAAAMYCAsQCAQAAAAHGAgEAAAABxwIBAAAAAQM2AACtCAAgiwMAAK4IACCRAwAAFgAgChoAALsGACAhAACCBwAgIgAAugYAIKUCAQAAAAGpAkAAAAABqgJAAAAAAf0CAQAAAAH-AgEAAAAB_wIBAAAAAYEDAAAAgQMCAgAAABIAIDYAAPwGACADAAAABQAgNgAA_AYAIDcAAIAHACAMAAAABQAgGgAAoQYAICEAAIEHACAiAACgBgAgLwAAgAcAIKUCAQDHBAAhqQJAAMkEACGqAkAAyQQAIf0CAQDHBAAh_gIBAMcEACH_AgEAxwQAIYEDAACdBoEDIgoaAAChBgAgIQAAgQcAICIAAKAGACClAgEAxwQAIakCQADJBAAhqgJAAMkEACH9AgEAxwQAIf4CAQDHBAAh_wIBAMcEACGBAwAAnQaBAyIFNgAAqAgAIDcAAKsIACCLAwAAqQgAIIwDAACqCAAgkQMAAAkAIAM2AACoCAAgiwMAAKkIACCRAwAACQAgBSYAALYHACAnAAC3BwAgpQIBAAAAAakCQAAAAAGqAkAAAAABAgAAAJ4BACA2AACDBwAgAwAAAAMAIDYAAIMHACA3AACHBwAgBwAAAAMAICYAAIgHACAnAACJBwAgLwAAhwcAIKUCAQDHBAAhqQJAAMkEACGqAkAAyQQAIQUmAACIBwAgJwAAiQcAIKUCAQDHBAAhqQJAAMkEACGqAkAAyQQAIQs2AACTBwAwNwAAmAcAMIsDAACUBwAwjAMAAJUHADCNAwAAlgcAII4DAACXBwAwjwMAAJcHADCQAwAAlwcAMJEDAACXBwAwkgMAAJkHADCTAwAAmgcAMAs2AACKBwAwNwAAjgcAMIsDAACLBwAwjAMAAIwHADCNAwAAjQcAII4DAACNBQAwjwMAAI0FADCQAwAAjQUAMJEDAACNBQAwkgMAAI8HADCTAwAAkAUAMBsKAAD-BQAgCwAA_wUAIAwAAIAGACANAACSBgAgEAAAgQYAIBMAAIIGACAXAACDBgAgGQAAhQYAIBoAAIQGACAbAACGBgAgHAAAhwYAIKUCAQAAAAGpAkAAAAABqgJAAAAAAcMCAAAAxgICyQIBAAAAAcsCAQAAAAHMAgEAAAABzQIBAAAAAc4CAQAAAAHPAgEAAAAB0AIQAAAAAdECAQAAAAHSAgEAAAAB0wIQAAAAAdUCAAAA1QIC1gJAAAAAAQIAAAAWACA2AACSBwAgAwAAABYAIDYAAJIHACA3AACRBwAgAS8AAKcIADACAAAAFgAgLwAAkQcAIAIAAACRBQAgLwAAkAcAIBClAgEAxwQAIakCQADJBAAhqgJAAMkEACHDAgAAkwXGAiLJAgEAxwQAIcsCAQDHBAAhzAIBAMcEACHNAgEA4wQAIc4CAQDjBAAhzwIBAMcEACHQAhAA1gQAIdECAQDjBAAh0gIBAMcEACHTAhAA1gQAIdUCAACUBdUCItYCQAD1BAAhGwoAAJcFACALAACYBQAgDAAAmQUAIA0AAJAGACAQAACaBQAgEwAAmwUAIBcAAJwFACAZAACeBQAgGgAAnQUAIBsAAJ8FACAcAACgBQAgpQIBAMcEACGpAkAAyQQAIaoCQADJBAAhwwIAAJMFxgIiyQIBAMcEACHLAgEAxwQAIcwCAQDHBAAhzQIBAOMEACHOAgEA4wQAIc8CAQDHBAAh0AIQANYEACHRAgEA4wQAIdICAQDHBAAh0wIQANYEACHVAgAAlAXVAiLWAkAA9QQAIRsKAAD-BQAgCwAA_wUAIAwAAIAGACANAACSBgAgEAAAgQYAIBMAAIIGACAXAACDBgAgGQAAhQYAIBoAAIQGACAbAACGBgAgHAAAhwYAIKUCAQAAAAGpAkAAAAABqgJAAAAAAcMCAAAAxgICyQIBAAAAAcsCAQAAAAHMAgEAAAABzQIBAAAAAc4CAQAAAAHPAgEAAAAB0AIQAAAAAdECAQAAAAHSAgEAAAAB0wIQAAAAAdUCAAAA1QIC1gJAAAAAAQwoAAC0BwAgKQAAtQcAIKUCAQAAAAGpAkAAAAABqgJAAAAAAYIDAQAAAAGDAwEAAAABhAMBAAAAAYUDAQAAAAGGAwEAAAABhwMQAAAAAYgDEAAAAAECAAAAAQAgNgAAswcAIAMAAAABACA2AACzBwAgNwAAngcAIAEvAACmCAAwEQEAAKcEACAoAACYBAAgKQAAmAQAIKICAAClBAAwowIAAFEAEKQCAAClBAAwpQIBAAAAAakCQADMAwAhqgJAAMwDACHKAgEAyQMAIYIDAQDiAwAhgwMBAMoDACGEAwEAygMAIYUDAQDKAwAhhgMBAOIDACGHAxAApgQAIYgDEACmBAAhAgAAAAEAIC8AAJ4HACACAAAAmwcAIC8AAJwHACAOogIAAJoHADCjAgAAmwcAEKQCAACaBwAwpQIBAMkDACGpAkAAzAMAIaoCQADMAwAhygIBAMkDACGCAwEA4gMAIYMDAQDKAwAhhAMBAMoDACGFAwEAygMAIYYDAQDiAwAhhwMQAKYEACGIAxAApgQAIQ6iAgAAmgcAMKMCAACbBwAQpAIAAJoHADClAgEAyQMAIakCQADMAwAhqgJAAMwDACHKAgEAyQMAIYIDAQDiAwAhgwMBAMoDACGEAwEAygMAIYUDAQDKAwAhhgMBAOIDACGHAxAApgQAIYgDEACmBAAhCqUCAQDHBAAhqQJAAMkEACGqAkAAyQQAIYIDAQDjBAAhgwMBAMcEACGEAwEAxwQAIYUDAQDHBAAhhgMBAOMEACGHAxAAnQcAIYgDEACdBwAhBY4DEAAAAAGUAxAAAAABlQMQAAAAAZYDEAAAAAGXAxAAAAABDCgAAJ8HACApAACgBwAgpQIBAMcEACGpAkAAyQQAIaoCQADJBAAhggMBAOMEACGDAwEAxwQAIYQDAQDHBAAhhQMBAMcEACGGAwEA4wQAIYcDEACdBwAhiAMQAJ0HACELNgAAqgcAMDcAAK4HADCLAwAAqwcAMIwDAACsBwAwjQMAAK0HACCOAwAAjQUAMI8DAACNBQAwkAMAAI0FADCRAwAAjQUAMJIDAACvBwAwkwMAAJAFADALNgAAoQcAMDcAAKUHADCLAwAAogcAMIwDAACjBwAwjQMAAKQHACCOAwAAjQUAMI8DAACNBQAwkAMAAI0FADCRAwAAjQUAMJIDAACmBwAwkwMAAJAFADAbAQAA_QUAIAoAAP4FACAMAACABgAgDQAAkgYAIBAAAIEGACATAACCBgAgFwAAgwYAIBkAAIUGACAaAACEBgAgGwAAhgYAIBwAAIcGACClAgEAAAABqQJAAAAAAaoCQAAAAAHDAgAAAMYCAskCAQAAAAHKAgEAAAABywIBAAAAAc0CAQAAAAHOAgEAAAABzwIBAAAAAdACEAAAAAHRAgEAAAAB0gIBAAAAAdMCEAAAAAHVAgAAANUCAtYCQAAAAAECAAAAFgAgNgAAqQcAIAMAAAAWACA2AACpBwAgNwAAqAcAIAEvAAClCAAwAgAAABYAIC8AAKgHACACAAAAkQUAIC8AAKcHACAQpQIBAMcEACGpAkAAyQQAIaoCQADJBAAhwwIAAJMFxgIiyQIBAMcEACHKAgEAxwQAIcsCAQDHBAAhzQIBAOMEACHOAgEA4wQAIc8CAQDHBAAh0AIQANYEACHRAgEA4wQAIdICAQDHBAAh0wIQANYEACHVAgAAlAXVAiLWAkAA9QQAIRsBAACWBQAgCgAAlwUAIAwAAJkFACANAACQBgAgEAAAmgUAIBMAAJsFACAXAACcBQAgGQAAngUAIBoAAJ0FACAbAACfBQAgHAAAoAUAIKUCAQDHBAAhqQJAAMkEACGqAkAAyQQAIcMCAACTBcYCIskCAQDHBAAhygIBAMcEACHLAgEAxwQAIc0CAQDjBAAhzgIBAOMEACHPAgEAxwQAIdACEADWBAAh0QIBAOMEACHSAgEAxwQAIdMCEADWBAAh1QIAAJQF1QIi1gJAAPUEACEbAQAA_QUAIAoAAP4FACAMAACABgAgDQAAkgYAIBAAAIEGACATAACCBgAgFwAAgwYAIBkAAIUGACAaAACEBgAgGwAAhgYAIBwAAIcGACClAgEAAAABqQJAAAAAAaoCQAAAAAHDAgAAAMYCAskCAQAAAAHKAgEAAAABywIBAAAAAc0CAQAAAAHOAgEAAAABzwIBAAAAAdACEAAAAAHRAgEAAAAB0gIBAAAAAdMCEAAAAAHVAgAAANUCAtYCQAAAAAEbAQAA_QUAIAsAAP8FACAMAACABgAgDQAAkgYAIBAAAIEGACATAACCBgAgFwAAgwYAIBkAAIUGACAaAACEBgAgGwAAhgYAIBwAAIcGACClAgEAAAABqQJAAAAAAaoCQAAAAAHDAgAAAMYCAskCAQAAAAHKAgEAAAABzAIBAAAAAc0CAQAAAAHOAgEAAAABzwIBAAAAAdACEAAAAAHRAgEAAAAB0gIBAAAAAdMCEAAAAAHVAgAAANUCAtYCQAAAAAECAAAAFgAgNgAAsgcAIAMAAAAWACA2AACyBwAgNwAAsQcAIAEvAACkCAAwAgAAABYAIC8AALEHACACAAAAkQUAIC8AALAHACAQpQIBAMcEACGpAkAAyQQAIaoCQADJBAAhwwIAAJMFxgIiyQIBAMcEACHKAgEAxwQAIcwCAQDHBAAhzQIBAOMEACHOAgEA4wQAIc8CAQDHBAAh0AIQANYEACHRAgEA4wQAIdICAQDHBAAh0wIQANYEACHVAgAAlAXVAiLWAkAA9QQAIRsBAACWBQAgCwAAmAUAIAwAAJkFACANAACQBgAgEAAAmgUAIBMAAJsFACAXAACcBQAgGQAAngUAIBoAAJ0FACAbAACfBQAgHAAAoAUAIKUCAQDHBAAhqQJAAMkEACGqAkAAyQQAIcMCAACTBcYCIskCAQDHBAAhygIBAMcEACHMAgEAxwQAIc0CAQDjBAAhzgIBAOMEACHPAgEAxwQAIdACEADWBAAh0QIBAOMEACHSAgEAxwQAIdMCEADWBAAh1QIAAJQF1QIi1gJAAPUEACEbAQAA_QUAIAsAAP8FACAMAACABgAgDQAAkgYAIBAAAIEGACATAACCBgAgFwAAgwYAIBkAAIUGACAaAACEBgAgGwAAhgYAIBwAAIcGACClAgEAAAABqQJAAAAAAaoCQAAAAAHDAgAAAMYCAskCAQAAAAHKAgEAAAABzAIBAAAAAc0CAQAAAAHOAgEAAAABzwIBAAAAAdACEAAAAAHRAgEAAAAB0gIBAAAAAdMCEAAAAAHVAgAAANUCAtYCQAAAAAEMKAAAtAcAICkAALUHACClAgEAAAABqQJAAAAAAaoCQAAAAAGCAwEAAAABgwMBAAAAAYQDAQAAAAGFAwEAAAABhgMBAAAAAYcDEAAAAAGIAxAAAAABBDYAAKoHADCLAwAAqwcAMI0DAACtBwAgkQMAAI0FADAENgAAoQcAMIsDAACiBwAwjQMAAKQHACCRAwAAjQUAMAQ2AACTBwAwiwMAAJQHADCNAwAAlgcAIJEDAACXBwAwBDYAAIoHADCLAwAAiwcAMI0DAACNBwAgkQMAAI0FADADNgAAgwcAIIsDAACEBwAgkQMAAJ4BACADNgAA_AYAIIsDAAD9BgAgkQMAABIAIAQ2AADxBgAwiwMAAPIGADCNAwAA9AYAIJEDAADyBQAwBDYAAOgGADCLAwAA6QYAMI0DAADrBgAgkQMAAOEFADAENgAA3wYAMIsDAADgBgAwjQMAAOIGACCRAwAA7gQAMAQ2AADUBgAwiwMAANUGADCNAwAA1wYAIJEDAAClBQAwAwIAAPQHACAmAAD1BwAgJwAA9gcAIAQCAAD0BwAgGgAAhwgAICEAAIUIACAiAADBBwAgAAAAAAAAAAAAAAAAAAAAEAEAAL4HACAKAACGCAAgCwAAhggAIAwAAIUIACANAACFCAAgEAAAwAcAIBMAAMEHACAXAADCBwAgGQAAhAgAIBoAAIcIACAbAACICAAgHAAAwwcAIM0CAADGBgAgzgIAAMYGACDRAgAAxgYAINYCAADGBgAgBQ4AAM8HACARAAC_BwAgGQAAhAgAINwCAADGBgAg9gIAAMYGACAAAAAAAAU2AACfCAAgNwAAoggAIIsDAACgCAAgjAMAAKEIACCRAwAAogMAIAM2AACfCAAgiwMAAKAIACCRAwAAogMAIAAAAAAABTYAAJoIACA3AACdCAAgiwMAAJsIACCMAwAAnAgAIJEDAAAWACADNgAAmggAIIsDAACbCAAgkQMAABYAIAAAAAAAAAAAAAU2AACVCAAgNwAAmAgAIIsDAACWCAAgjAMAAJcIACCRAwAAogMAIAM2AACVCAAgiwMAAJYIACCRAwAAogMAIAAAAAAAAAAABTYAAJAIACA3AACTCAAgiwMAAJEIACCMAwAAkggAIJEDAACKAwAgAzYAAJAIACCLAwAAkQgAIJEDAACKAwAgCgEAAL4HACARAAC_BwAgHAAAwwcAICMAAMAHACAkAADBBwAgJQAAwgcAILoCAADGBgAguwIAAMYGACC-AgAAxgYAIL8CAADGBgAgAAAAAAAAAAAAAAAAAAU2AACLCAAgNwAAjggAIIsDAACMCAAgjAMAAI0IACCRAwAAngEAIAM2AACLCAAgiwMAAIwIACCRAwAAngEAIAUOAADPBwAgGAAA0AcAINoCAADGBgAg2wIAAMYGACDcAgAAxgYAIAcGAACJCAAgCQAAiggAIB0AAPYHACAeAAD2BwAgHwAAwgcAICAAAMIHACC_AgAAxgYAIAcBAAC-BwAgKAAA9gcAICkAAPYHACCCAwAAxgYAIIYDAADGBgAghwMAAMYGACCIAwAAxgYAIAADDgAAzwcAIOUCAADGBgAg5gIAAMYGACACBQAAxAYAIAcAAMUGACAABgIAAPMHACAnAAC3BwAgpQIBAAAAAakCQAAAAAGqAkAAAAAB5wIBAAAAAQIAAACeAQAgNgAAiwgAIAMAAAADACA2AACLCAAgNwAAjwgAIAgAAAADACACAADyBwAgJwAAiQcAIC8AAI8IACClAgEAxwQAIakCQADJBAAhqgJAAMkEACHnAgEAxwQAIQYCAADyBwAgJwAAiQcAIKUCAQDHBAAhqQJAAMkEACGqAkAAyQQAIecCAQDHBAAhEREAALkHACAcAAC9BwAgIwAAugcAICQAALsHACAlAAC8BwAgpQIBAAAAAaYCAQAAAAGpAkAAAAABqgJAAAAAAbkCAQAAAAG6AgEAAAABuwIBAAAAAb0CAAAAvQICvgIgAAAAAb8CAQAAAAHBAgAAAMECAsMCAAAAwwICAgAAAIoDACA2AACQCAAgAwAAAB4AIDYAAJAIACA3AACUCAAgEwAAAB4AIBEAAM8GACAcAADTBgAgIwAA0AYAICQAANEGACAlAADSBgAgLwAAlAgAIKUCAQDHBAAhpgIBAMcEACGpAkAAyQQAIaoCQADJBAAhuQIBAMcEACG6AgEA4wQAIbsCAQDjBAAhvQIAAMoGvQIivgIgAMsGACG_AgEA4wQAIcECAADMBsECIsMCAADNBsMCIhERAADPBgAgHAAA0wYAICMAANAGACAkAADRBgAgJQAA0gYAIKUCAQDHBAAhpgIBAMcEACGpAkAAyQQAIaoCQADJBAAhuQIBAMcEACG6AgEA4wQAIbsCAQDjBAAhvQIAAMoGvQIivgIgAMsGACG_AgEA4wQAIcECAADMBsECIsMCAADNBsMCIgcHAADDBgAgpQIBAAAAAaYCAQAAAAGnAgEAAAABqAIgAAAAAakCQAAAAAGqAkAAAAABAgAAAKIDACA2AACVCAAgAwAAAKUDACA2AACVCAAgNwAAmQgAIAkAAAClAwAgBwAAywQAIC8AAJkIACClAgEAxwQAIaYCAQDHBAAhpwIBAMcEACGoAiAAyAQAIakCQADJBAAhqgJAAMkEACEHBwAAywQAIKUCAQDHBAAhpgIBAMcEACGnAgEAxwQAIagCIADIBAAhqQJAAMkEACGqAkAAyQQAIRwBAAD9BQAgCgAA_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_gUAIAsAAP8FACAMAACABgAgDQAAkgYAIBMAAIIGACAXAACDBgAgGQAAhQYAIBoAAIQGACAbAACGBgAgHAAAhwYAIKUCAQAAAAGpAkAAAAABqgJAAAAAAcMCAAAAxgICyQIBAAAAAcoCAQAAAAHLAgEAAAABzAIBAAAAAc0CAQAAAAHOAgEAAAABzwIBAAAAAdACEAAAAAHRAgEAAAAB0gIBAAAAAdMCEAAAAAHVAgAAANUCAtYCQAAAAAECAAAAFgAgNgAArQgAIAMAAAAUACA2AACtCAAgNwAAsQgAIB4AAAAUACABAACWBQAgCgAAlwUAIAsAAJgFACAMAACZBQAgDQAAkAYAIBMAAJsFACAXAACcBQAgGQAAngUAIBoAAJ0FACAbAACfBQAgHAAAoAUAIC8AALEIACClAgEAxwQAIakCQADJBAAhqgJAAMkEACHDAgAAkwXGAiLJAgEAxwQAIcoCAQDHBAAhywIBAMcEACHMAgEAxwQAIc0CAQDjBAAhzgIBAOMEACHPAgEAxwQAIdACEADWBAAh0QIBAOMEACHSAgEAxwQAIdMCEADWBAAh1QIAAJQF1QIi1gJAAPUEACEcAQAAlgUAIAoAAJcFACALAACYBQAgDAAAmQUAIA0AAJAGACATAACbBQAgFwAAnAUAIBkAAJ4FACAaAACdBQAgGwAAnwUAIBwAAKAFACClAgEAxwQAIakCQADJBAAhqgJAAMkEACHDAgAAkwXGAiLJAgEAxwQAIcoCAQDHBAAhywIBAMcEACHMAgEAxwQAIc0CAQDjBAAhzgIBAOMEACHPAgEAxwQAIdACEADWBAAh0QIBAOMEACHSAgEAxwQAIdMCEADWBAAh1QIAAJQF1QIi1gJAAPUEACEGpQIBAAAAAakCQAAAAAHDAgAAAMYCAsQCAQAAAAHGAgEAAAABxwIBAAAAAQmlAgEAAAABqQJAAAAAAaoCQAAAAAHDAgAAAPoCAsQCAQAAAAHzAgEAAAAB-gJAAAAAAfsCQAAAAAH8AkAAAAABCaUCAQAAAAGpAkAAAAABqgJAAAAAAcMCAAAA7wICxAIBAAAAAewCAQAAAAHtAgEAAAAB7wJAAAAAAfACQAAAAAEcAQAA_QUAIAoAAP4FACALAAD_BQAgDAAAgAYAIA0AAJIGACAQAACBBgAgEwAAggYAIBcAAIMGACAZAACFBgAgGgAAhAYAIBsAAIYGACClAgEAAAABqQJAAAAAAaoCQAAAAAHDAgAAAMYCAskCAQAAAAHKAgEAAAABywIBAAAAAcwCAQAAAAHNAgEAAAABzgIBAAAAAc8CAQAAAAHQAhAAAAAB0QIBAAAAAdICAQAAAAHTAhAAAAAB1QIAAADVAgLWAkAAAAABAgAAABYAIDYAALUIACADAAAAFAAgNgAAtQgAIDcAALkIACAeAAAAFAAgAQAAlgUAIAoAAJcFACALAACYBQAgDAAAmQUAIA0AAJAGACAQAACaBQAgEwAAmwUAIBcAAJwFACAZAACeBQAgGgAAnQUAIBsAAJ8FACAvAAC5CAAgpQIBAMcEACGpAkAAyQQAIaoCQADJBAAhwwIAAJMFxgIiyQIBAMcEACHKAgEAxwQAIcsCAQDHBAAhzAIBAMcEACHNAgEA4wQAIc4CAQDjBAAhzwIBAMcEACHQAhAA1gQAIdECAQDjBAAh0gIBAMcEACHTAhAA1gQAIdUCAACUBdUCItYCQAD1BAAhHAEAAJYFACAKAACXBQAgCwAAmAUAIAwAAJkFACANAACQBgAgEAAAmgUAIBMAAJsFACAXAACcBQAgGQAAngUAIBoAAJ0FACAbAACfBQAgpQIBAMcEACGpAkAAyQQAIaoCQADJBAAhwwIAAJMFxgIiyQIBAMcEACHKAgEAxwQAIcsCAQDHBAAhzAIBAMcEACHNAgEA4wQAIc4CAQDjBAAhzwIBAMcEACHQAhAA1gQAIdECAQDjBAAh0gIBAMcEACHTAhAA1gQAIdUCAACUBdUCItYCQAD1BAAhB6UCAQAAAAGpAkAAAAABxAIBAAAAAegCAQAAAAHpAgEAAAAB6gIBAAAAAesCIAAAAAERAQAAuAcAIBwAAL0HACAjAAC6BwAgJAAAuwcAICUAALwHACClAgEAAAABpgIBAAAAAakCQAAAAAGqAkAAAAABuQIBAAAAAboCAQAAAAG7AgEAAAABvQIAAAC9AgK-AiAAAAABvwIBAAAAAcECAAAAwQICwwIAAADDAgICAAAAigMAIDYAALsIACAcAQAA_QUAIAoAAP4FACALAAD_BQAgDAAAgAYAIA0AAJIGACAQAACBBgAgFwAAgwYAIBkAAIUGACAaAACEBgAgGwAAhgYAIBwAAIcGACClAgEAAAABqQJAAAAAAaoCQAAAAAHDAgAAAMYCAskCAQAAAAHKAgEAAAABywIBAAAAAcwCAQAAAAHNAgEAAAABzgIBAAAAAc8CAQAAAAHQAhAAAAAB0QIBAAAAAdICAQAAAAHTAhAAAAAB1QIAAADVAgLWAkAAAAABAgAAABYAIDYAAL0IACADAAAAFAAgNgAAvQgAIDcAAMEIACAeAAAAFAAgAQAAlgUAIAoAAJcFACALAACYBQAgDAAAmQUAIA0AAJAGACAQAACaBQAgFwAAnAUAIBkAAJ4FACAaAACdBQAgGwAAnwUAIBwAAKAFACAvAADBCAAgpQIBAMcEACGpAkAAyQQAIaoCQADJBAAhwwIAAJMFxgIiyQIBAMcEACHKAgEAxwQAIcsCAQDHBAAhzAIBAMcEACHNAgEA4wQAIc4CAQDjBAAhzwIBAMcEACHQAhAA1gQAIdECAQDjBAAh0gIBAMcEACHTAhAA1gQAIdUCAACUBdUCItYCQAD1BAAhHAEAAJYFACAKAACXBQAgCwAAmAUAIAwAAJkFACANAACQBgAgEAAAmgUAIBcAAJwFACAZAACeBQAgGgAAnQUAIBsAAJ8FACAcAACgBQAgpQIBAMcEACGpAkAAyQQAIaoCQADJBAAhwwIAAJMFxgIiyQIBAMcEACHKAgEAxwQAIcsCAQDHBAAhzAIBAMcEACHNAgEA4wQAIc4CAQDjBAAhzwIBAMcEACHQAhAA1gQAIdECAQDjBAAh0gIBAMcEACHTAhAA1gQAIdUCAACUBdUCItYCQAD1BAAhCaUCAQAAAAGpAkAAAAABqgJAAAAAAcMCAAAA-gICxAIBAAAAAfgCAQAAAAH6AkAAAAAB-wJAAAAAAfwCQAAAAAEcAQAA_QUAIAoAAP4FACALAAD_BQAgDAAAgAYAIA0AAJIGACAQAACBBgAgEwAAggYAIBcAAIMGACAZAACFBgAgGwAAhgYAIBwAAIcGACClAgEAAAABqQJAAAAAAaoCQAAAAAHDAgAAAMYCAskCAQAAAAHKAgEAAAABywIBAAAAAcwCAQAAAAHNAgEAAAABzgIBAAAAAc8CAQAAAAHQAhAAAAAB0QIBAAAAAdICAQAAAAHTAhAAAAAB1QIAAADVAgLWAkAAAAABAgAAABYAIDYAAMMIACADAAAAFAAgNgAAwwgAIDcAAMcIACAeAAAAFAAgAQAAlgUAIAoAAJcFACALAACYBQAgDAAAmQUAIA0AAJAGACAQAACaBQAgEwAAmwUAIBcAAJwFACAZAACeBQAgGwAAnwUAIBwAAKAFACAvAADHCAAgpQIBAMcEACGpAkAAyQQAIaoCQADJBAAhwwIAAJMFxgIiyQIBAMcEACHKAgEAxwQAIcsCAQDHBAAhzAIBAMcEACHNAgEA4wQAIc4CAQDjBAAhzwIBAMcEACHQAhAA1gQAIdECAQDjBAAh0gIBAMcEACHTAhAA1gQAIdUCAACUBdUCItYCQAD1BAAhHAEAAJYFACAKAACXBQAgCwAAmAUAIAwAAJkFACANAACQBgAgEAAAmgUAIBMAAJsFACAXAACcBQAgGQAAngUAIBsAAJ8FACAcAACgBQAgpQIBAMcEACGpAkAAyQQAIaoCQADJBAAhwwIAAJMFxgIiyQIBAMcEACHKAgEAxwQAIcsCAQDHBAAhzAIBAMcEACHNAgEA4wQAIc4CAQDjBAAhzwIBAMcEACHQAhAA1gQAIdECAQDjBAAh0gIBAMcEACHTAhAA1gQAIdUCAACUBdUCItYCQAD1BAAhCKUCAQAAAAGpAkAAAAABwwIAAAD2AgLEAgEAAAAB3AIBAAAAAfQCAgAAAAH2AgEAAAAB9wJAAAAAAQMAAAAeACA2AAC7CAAgNwAAywgAIBMAAAAeACABAADOBgAgHAAA0wYAICMAANAGACAkAADRBgAgJQAA0gYAIC8AAMsIACClAgEAxwQAIaYCAQDHBAAhqQJAAMkEACGqAkAAyQQAIbkCAQDHBAAhugIBAOMEACG7AgEA4wQAIb0CAADKBr0CIr4CIADLBgAhvwIBAOMEACHBAgAAzAbBAiLDAgAAzQbDAiIRAQAAzgYAIBwAANMGACAjAADQBgAgJAAA0QYAICUAANIGACClAgEAxwQAIaYCAQDHBAAhqQJAAMkEACGqAkAAyQQAIbkCAQDHBAAhugIBAOMEACG7AgEA4wQAIb0CAADKBr0CIr4CIADLBgAhvwIBAOMEACHBAgAAzAbBAiLDAgAAzQbDAiIHpQIBAAAAAakCQAAAAAGqAkAAAAAB5wIBAAAAAf4CAQAAAAH_AgEAAAABgQMAAACBAwIOBgAA6QcAIAkAAL0GACAdAAC-BgAgHwAAwAYAICAAAMEGACClAgEAAAABpgIBAAAAAacCAQAAAAGoAiAAAAABqQJAAAAAAaoCQAAAAAG_AgEAAAAB3QIBAAAAAfICAQAAAAECAAAACQAgNgAAzQgAIAMAAAAHACA2AADNCAAgNwAA0QgAIBAAAAAHACAGAADoBwAgCQAA5QQAIB0AAOYEACAfAADoBAAgIAAA6QQAIC8AANEIACClAgEAxwQAIaYCAQDHBAAhpwIBAMcEACGoAiAAyAQAIakCQADJBAAhqgJAAMkEACG_AgEA4wQAId0CAQDHBAAh8gIBAMcEACEOBgAA6AcAIAkAAOUEACAdAADmBAAgHwAA6AQAICAAAOkEACClAgEAxwQAIaYCAQDHBAAhpwIBAMcEACGoAiAAyAQAIakCQADJBAAhqgJAAMkEACG_AgEA4wQAId0CAQDHBAAh8gIBAMcEACEQpQIBAAAAAakCQAAAAAGqAkAAAAABwwIAAADGAgLJAgEAAAABygIBAAAAAcsCAQAAAAHMAgEAAAABzgIBAAAAAc8CAQAAAAHQAhAAAAAB0QIBAAAAAdICAQAAAAHTAhAAAAAB1QIAAADVAgLWAkAAAAABDgYAAOkHACAJAAC9BgAgHgAAvwYAIB8AAMAGACAgAADBBgAgpQIBAAAAAaYCAQAAAAGnAgEAAAABqAIgAAAAAakCQAAAAAGqAkAAAAABvwIBAAAAAd0CAQAAAAHyAgEAAAABAgAAAAkAIDYAANMIACANAQAAgwgAICgAALQHACClAgEAAAABqQJAAAAAAaoCQAAAAAHKAgEAAAABggMBAAAAAYMDAQAAAAGEAwEAAAABhQMBAAAAAYYDAQAAAAGHAxAAAAABiAMQAAAAAQIAAAABACA2AADVCAAgDQEAAIMIACApAAC1BwAgpQIBAAAAAakCQAAAAAGqAkAAAAABygIBAAAAAYIDAQAAAAGDAwEAAAABhAMBAAAAAYUDAQAAAAGGAwEAAAABhwMQAAAAAYgDEAAAAAECAAAAAQAgNgAA1wgAIAYCAADzBwAgJgAAtgcAIKUCAQAAAAGpAkAAAAABqgJAAAAAAecCAQAAAAECAAAAngEAIDYAANkIACARAQAAuAcAIBEAALkHACAcAAC9BwAgJAAAuwcAICUAALwHACClAgEAAAABpgIBAAAAAakCQAAAAAGqAkAAAAABuQIBAAAAAboCAQAAAAG7AgEAAAABvQIAAAC9AgK-AiAAAAABvwIBAAAAAcECAAAAwQICwwIAAADDAgICAAAAigMAIDYAANsIACADAAAAHgAgNgAA2wgAIDcAAN8IACATAAAAHgAgAQAAzgYAIBEAAM8GACAcAADTBgAgJAAA0QYAICUAANIGACAvAADfCAAgpQIBAMcEACGmAgEAxwQAIakCQADJBAAhqgJAAMkEACG5AgEAxwQAIboCAQDjBAAhuwIBAOMEACG9AgAAyga9AiK-AiAAywYAIb8CAQDjBAAhwQIAAMwGwQIiwwIAAM0GwwIiEQEAAM4GACARAADPBgAgHAAA0wYAICQAANEGACAlAADSBgAgpQIBAMcEACGmAgEAxwQAIakCQADJBAAhqgJAAMkEACG5AgEAxwQAIboCAQDjBAAhuwIBAOMEACG9AgAAyga9AiK-AiAAywYAIb8CAQDjBAAhwQIAAMwGwQIiwwIAAM0GwwIiBqUCAQAAAAGpAkAAAAABwwIAAADGAgLGAgEAAAABxwIBAAAAAcgCAQAAAAERAQAAuAcAIBEAALkHACAcAAC9BwAgIwAAugcAICUAALwHACClAgEAAAABpgIBAAAAAakCQAAAAAGqAkAAAAABuQIBAAAAAboCAQAAAAG7AgEAAAABvQIAAAC9AgK-AiAAAAABvwIBAAAAAcECAAAAwQICwwIAAADDAgICAAAAigMAIDYAAOEIACALAgAAuQYAIBoAALsGACAhAACCBwAgpQIBAAAAAakCQAAAAAGqAkAAAAAB5wIBAAAAAf0CAQAAAAH-AgEAAAAB_wIBAAAAAYEDAAAAgQMCAgAAABIAIDYAAOMIACADAAAAHgAgNgAA4QgAIDcAAOcIACATAAAAHgAgAQAAzgYAIBEAAM8GACAcAADTBgAgIwAA0AYAICUAANIGACAvAADnCAAgpQIBAMcEACGmAgEAxwQAIakCQADJBAAhqgJAAMkEACG5AgEAxwQAIboCAQDjBAAhuwIBAOMEACG9AgAAyga9AiK-AiAAywYAIb8CAQDjBAAhwQIAAMwGwQIiwwIAAM0GwwIiEQEAAM4GACARAADPBgAgHAAA0wYAICMAANAGACAlAADSBgAgpQIBAMcEACGmAgEAxwQAIakCQADJBAAhqgJAAMkEACG5AgEAxwQAIboCAQDjBAAhuwIBAOMEACG9AgAAyga9AiK-AiAAywYAIb8CAQDjBAAhwQIAAMwGwQIiwwIAAM0GwwIiAwAAAAUAIDYAAOMIACA3AADqCAAgDQAAAAUAIAIAAJ8GACAaAAChBgAgIQAAgQcAIC8AAOoIACClAgEAxwQAIakCQADJBAAhqgJAAMkEACHnAgEAxwQAIf0CAQDHBAAh_gIBAMcEACH_AgEAxwQAIYEDAACdBoEDIgsCAACfBgAgGgAAoQYAICEAAIEHACClAgEAxwQAIakCQADJBAAhqgJAAMkEACHnAgEAxwQAIf0CAQDHBAAh_gIBAMcEACH_AgEAxwQAIYEDAACdBoEDIgmlAgEAAAABqQJAAAAAAaoCQAAAAAHDAgAAAPoCAvMCAQAAAAH4AgEAAAAB-gJAAAAAAfsCQAAAAAH8AkAAAAABCaUCAQAAAAGpAkAAAAABqgJAAAAAAcMCAAAA7wIC7AIBAAAAAe0CAQAAAAHvAkAAAAAB8AJAAAAAAfECAQAAAAELAgAAuQYAICEAAIIHACAiAAC6BgAgpQIBAAAAAakCQAAAAAGqAkAAAAAB5wIBAAAAAf0CAQAAAAH-AgEAAAAB_wIBAAAAAYEDAAAAgQMCAgAAABIAIDYAAO0IACAcAQAA_QUAIAoAAP4FACALAAD_BQAgDAAAgAYAIA0AAJIGACAQAACBBgAgEwAAggYAIBcAAIMGACAaAACEBgAgGwAAhgYAIBwAAIcGACClAgEAAAABqQJAAAAAAaoCQAAAAAHDAgAAAMYCAskCAQAAAAHKAgEAAAABywIBAAAAAcwCAQAAAAHNAgEAAAABzgIBAAAAAc8CAQAAAAHQAhAAAAAB0QIBAAAAAdICAQAAAAHTAhAAAAAB1QIAAADVAgLWAkAAAAABAgAAABYAIDYAAO8IACADAAAAFAAgNgAA7wgAIDcAAPMIACAeAAAAFAAgAQAAlgUAIAoAAJcFACALAACYBQAgDAAAmQUAIA0AAJAGACAQAACaBQAgEwAAmwUAIBcAAJwFACAaAACdBQAgGwAAnwUAIBwAAKAFACAvAADzCAAgpQIBAMcEACGpAkAAyQQAIaoCQADJBAAhwwIAAJMFxgIiyQIBAMcEACHKAgEAxwQAIcsCAQDHBAAhzAIBAMcEACHNAgEA4wQAIc4CAQDjBAAhzwIBAMcEACHQAhAA1gQAIdECAQDjBAAh0gIBAMcEACHTAhAA1gQAIdUCAACUBdUCItYCQAD1BAAhHAEAAJYFACAKAACXBQAgCwAAmAUAIAwAAJkFACANAACQBgAgEAAAmgUAIBMAAJsFACAXAACcBQAgGgAAnQUAIBsAAJ8FACAcAACgBQAgpQIBAMcEACGpAkAAyQQAIaoCQADJBAAhwwIAAJMFxgIiyQIBAMcEACHKAgEAxwQAIcsCAQDHBAAhzAIBAMcEACHNAgEA4wQAIc4CAQDjBAAhzwIBAMcEACHQAhAA1gQAIdECAQDjBAAh0gIBAMcEACHTAhAA1gQAIdUCAACUBdUCItYCQAD1BAAhAwAAAAUAIDYAAO0IACA3AAD2CAAgDQAAAAUAIAIAAJ8GACAhAACBBwAgIgAAoAYAIC8AAPYIACClAgEAxwQAIakCQADJBAAhqgJAAMkEACHnAgEAxwQAIf0CAQDHBAAh_gIBAMcEACH_AgEAxwQAIYEDAACdBoEDIgsCAACfBgAgIQAAgQcAICIAAKAGACClAgEAxwQAIakCQADJBAAhqgJAAMkEACHnAgEAxwQAIf0CAQDHBAAh_gIBAMcEACH_AgEAxwQAIYEDAACdBoEDIgilAgEAAAABqQJAAAAAAcMCAAAA9gIC3AIBAAAAAfMCAQAAAAH0AgIAAAAB9gIBAAAAAfcCQAAAAAELDgAArAYAIBEAANIFACClAgEAAAABqQJAAAAAAcMCAAAA9gICxAIBAAAAAdwCAQAAAAHzAgEAAAAB9AICAAAAAfYCAQAAAAH3AkAAAAABAgAAACwAIDYAAPgIACADAAAAKgAgNgAA-AgAIDcAAPwIACANAAAAKgAgDgAAqgYAIBEAAMgFACAvAAD8CAAgpQIBAMcEACGpAkAAyQQAIcMCAADGBfYCIsQCAQDHBAAh3AIBAOMEACHzAgEAxwQAIfQCAgDFBQAh9gIBAOMEACH3AkAAyQQAIQsOAACqBgAgEQAAyAUAIKUCAQDHBAAhqQJAAMkEACHDAgAAxgX2AiLEAgEAxwQAIdwCAQDjBAAh8wIBAMcEACH0AgIAxQUAIfYCAQDjBAAh9wJAAMkEACERAQAAuAcAIBEAALkHACAjAAC6BwAgJAAAuwcAICUAALwHACClAgEAAAABpgIBAAAAAakCQAAAAAGqAkAAAAABuQIBAAAAAboCAQAAAAG7AgEAAAABvQIAAAC9AgK-AiAAAAABvwIBAAAAAcECAAAAwQICwwIAAADDAgICAAAAigMAIDYAAP0IACADAAAAHgAgNgAA_QgAIDcAAIEJACATAAAAHgAgAQAAzgYAIBEAAM8GACAjAADQBgAgJAAA0QYAICUAANIGACAvAACBCQAgpQIBAMcEACGmAgEAxwQAIakCQADJBAAhqgJAAMkEACG5AgEAxwQAIboCAQDjBAAhuwIBAOMEACG9AgAAyga9AiK-AiAAywYAIb8CAQDjBAAhwQIAAMwGwQIiwwIAAM0GwwIiEQEAAM4GACARAADPBgAgIwAA0AYAICQAANEGACAlAADSBgAgpQIBAMcEACGmAgEAxwQAIakCQADJBAAhqgJAAMkEACG5AgEAxwQAIboCAQDjBAAhuwIBAOMEACG9AgAAyga9AiK-AiAAywYAIb8CAQDjBAAhwQIAAMwGwQIiwwIAAM0GwwIiB6UCAQAAAAGpAkAAAAAB5wIBAAAAAegCAQAAAAHpAgEAAAAB6gIBAAAAAesCIAAAAAEDAAAABwAgNgAA0wgAIDcAAIUJACAQAAAABwAgBgAA6AcAIAkAAOUEACAeAADnBAAgHwAA6AQAICAAAOkEACAvAACFCQAgpQIBAMcEACGmAgEAxwQAIacCAQDHBAAhqAIgAMgEACGpAkAAyQQAIaoCQADJBAAhvwIBAOMEACHdAgEAxwQAIfICAQDHBAAhDgYAAOgHACAJAADlBAAgHgAA5wQAIB8AAOgEACAgAADpBAAgpQIBAMcEACGmAgEAxwQAIacCAQDHBAAhqAIgAMgEACGpAkAAyQQAIaoCQADJBAAhvwIBAOMEACHdAgEAxwQAIfICAQDHBAAhAwAAAFEAIDYAANUIACA3AACICQAgDwAAAFEAIAEAAIIIACAoAACfBwAgLwAAiAkAIKUCAQDHBAAhqQJAAMkEACGqAkAAyQQAIcoCAQDHBAAhggMBAOMEACGDAwEAxwQAIYQDAQDHBAAhhQMBAMcEACGGAwEA4wQAIYcDEACdBwAhiAMQAJ0HACENAQAAgggAICgAAJ8HACClAgEAxwQAIakCQADJBAAhqgJAAMkEACHKAgEAxwQAIYIDAQDjBAAhgwMBAMcEACGEAwEAxwQAIYUDAQDHBAAhhgMBAOMEACGHAxAAnQcAIYgDEACdBwAhAwAAAFEAIDYAANcIACA3AACLCQAgDwAAAFEAIAEAAIIIACApAACgBwAgLwAAiwkAIKUCAQDHBAAhqQJAAMkEACGqAkAAyQQAIcoCAQDHBAAhggMBAOMEACGDAwEAxwQAIYQDAQDHBAAhhQMBAMcEACGGAwEA4wQAIYcDEACdBwAhiAMQAJ0HACENAQAAgggAICkAAKAHACClAgEAxwQAIakCQADJBAAhqgJAAMkEACHKAgEAxwQAIYIDAQDjBAAhgwMBAMcEACGEAwEAxwQAIYUDAQDHBAAhhgMBAOMEACGHAxAAnQcAIYgDEACdBwAhAwAAAAMAIDYAANkIACA3AACOCQAgCAAAAAMAIAIAAPIHACAmAACIBwAgLwAAjgkAIKUCAQDHBAAhqQJAAMkEACGqAkAAyQQAIecCAQDHBAAhBgIAAPIHACAmAACIBwAgpQIBAMcEACGpAkAAyQQAIaoCQADJBAAh5wIBAMcEACEQpQIBAAAAAakCQAAAAAGqAkAAAAABwwIAAADGAgLJAgEAAAABygIBAAAAAcsCAQAAAAHMAgEAAAABzQIBAAAAAc8CAQAAAAHQAhAAAAAB0QIBAAAAAdICAQAAAAHTAhAAAAAB1QIAAADVAgLWAkAAAAABDgYAAOkHACAJAAC9BgAgHQAAvgYAIB4AAL8GACAfAADABgAgpQIBAAAAAaYCAQAAAAGnAgEAAAABqAIgAAAAAakCQAAAAAGqAkAAAAABvwIBAAAAAd0CAQAAAAHyAgEAAAABAgAAAAkAIDYAAJAJACADAAAABwAgNgAAkAkAIDcAAJQJACAQAAAABwAgBgAA6AcAIAkAAOUEACAdAADmBAAgHgAA5wQAIB8AAOgEACAvAACUCQAgpQIBAMcEACGmAgEAxwQAIacCAQDHBAAhqAIgAMgEACGpAkAAyQQAIaoCQADJBAAhvwIBAOMEACHdAgEAxwQAIfICAQDHBAAhDgYAAOgHACAJAADlBAAgHQAA5gQAIB4AAOcEACAfAADoBAAgpQIBAMcEACGmAgEAxwQAIacCAQDHBAAhqAIgAMgEACGpAkAAyQQAIaoCQADJBAAhvwIBAOMEACHdAgEAxwQAIfICAQDHBAAhCaUCAQAAAAGpAkAAAAABqgJAAAAAAcMCAAAA7wICxAIBAAAAAe0CAQAAAAHvAkAAAAAB8AJAAAAAAfECAQAAAAERAQAAuAcAIBEAALkHACAcAAC9BwAgIwAAugcAICQAALsHACClAgEAAAABpgIBAAAAAakCQAAAAAGqAkAAAAABuQIBAAAAAboCAQAAAAG7AgEAAAABvQIAAAC9AgK-AiAAAAABvwIBAAAAAcECAAAAwQICwwIAAADDAgICAAAAigMAIDYAAJYJACAOBgAA6QcAIAkAAL0GACAdAAC-BgAgHgAAvwYAICAAAMEGACClAgEAAAABpgIBAAAAAacCAQAAAAGoAiAAAAABqQJAAAAAAaoCQAAAAAG_AgEAAAAB3QIBAAAAAfICAQAAAAECAAAACQAgNgAAmAkAIBwBAAD9BQAgCgAA_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-ADM_ADQCDgAJEQAEAg4ACREABAUIADk8ADo9ADs-ADw_AD0AAAAAAAUIADk8ADo9ADs-ADw_AD0BBgAGAQYABgMIAEI-AEM_AEQAAAADCABCPgBDPwBEBA4ACRQABRUABRbsAQMEDgAJFAAFFQAFFvIBAwMIAEk-AEo_AEsAAAADCABJPgBKPwBLAgIAAw6EAgkCAgADDooCCQMIAFA-AFE_AFIAAAADCABQPgBRPwBSAQ4ACQEOAAkFCABXPABYPQBZPgBaPwBbAAAAAAAFCABXPABYPQBZPgBaPwBbAQYABgEGAAYFCABgPABhPQBiPgBjPwBkAAAAAAAFCABgPABhPQBiPgBjPwBkAg4ACRgADQIOAAkYAA0DCABpPgBqPwBrAAAAAwgAaT4Aaj8AawUBAAIKAAELAAEM4gIFDeMCBQUBAAIKAAELAAEM6QIFDeoCBQUIAHA8AHE9AHI-AHM_AHQAAAAAAAUIAHA8AHE9AHI-AHM_AHQCDgAJD_wCAwIOAAkPggMDAwgAeT4Aej8AewAAAAMIAHk-AHo_AHsAAAMIAIABPgCBAT8AggEAAAADCACAAT4AgQE_AIIBAAADCACHAT4AiAE_AIkBAAAAAwgAhwE-AIgBPwCJASoCAStbASxcAS1dAS5eATBgATFiFzJjGDNlATRnFzVoGThpATlqATprF0BuGkFvIEJwBENxBERyBEVzBEZ0BEd2BEh4F0l5IUp7BEt9F0x-Ik1_BE6AAQRPgQEXUIQBI1GFASdShgELU4cBC1SIAQtViQELVooBC1eMAQtYjgEXWY8BKFqSAQtblAEXXJUBKV2XAQtemAELX5kBF2CcASphnQEuYp8BAmOgAQJkogECZaMBAmakAQJnpgECaKgBF2mpAS9qqwECa60BF2yuATBtrwECbrABAm-xARdwtAExcbUBNXK2AQ1ztwENdLgBDXW5AQ12ugENd7wBDXi-ARd5vwE2esEBDXvDARd8xAE3fcUBDX7GAQ1_xwEXgAHKATiBAcsBPoIBzAEFgwHNAQWEAc4BBYUBzwEFhgHQAQWHAdIBBYgB1AEXiQHVAT-KAdcBBYsB2QEXjAHaAUCNAdsBBY4B3AEFjwHdAReQAeABQZEB4QFFkgHiAQyTAeMBDJQB5AEMlQHlAQyWAeYBDJcB6AEMmAHqAReZAesBRpoB7gEMmwHwARecAfEBR50B8wEMngH0AQyfAfUBF6AB-AFIoQH5AUyiAfoBEKMB-wEQpAH8ARClAf0BEKYB_gEQpwGAAhCoAYICF6kBgwJNqgGGAhCrAYgCF6wBiQJOrQGLAhCuAYwCEK8BjQIXsAGQAk-xAZECU7IBkwIPswGUAg-0AZYCD7UBlwIPtgGYAg-3AZoCD7gBnAIXuQGdAlS6AZ8CD7sBoQIXvAGiAlW9AaMCD74BpAIPvwGlAhfAAagCVsEBqQJcwgGqAgfDAasCB8QBrAIHxQGtAgfGAa4CB8cBsAIHyAGyAhfJAbMCXcoBtQIHywG3AhfMAbgCXs0BuQIHzgG6AgfPAbsCF9ABvgJf0QG_AmXSAcECDtMBwgIO1AHEAg7VAcUCDtYBxgIO1wHIAg7YAcoCF9kBywJm2gHNAg7bAc8CF9wB0AJn3QHRAg7eAdICDt8B0wIX4AHWAmjhAdcCbOIB2AIJ4wHZAgnkAdoCCeUB2wIJ5gHcAgnnAd4CCegB4AIX6QHhAm3qAeUCCesB5wIX7AHoAm7tAesCCe4B7AIJ7wHtAhfwAfACb_EB8QJ18gHyAgrzAfMCCvQB9AIK9QH1Agr2AfYCCvcB-AIK-AH6Ahf5AfsCdvoB_gIK-wGAAxf8AYEDd_0BgwMK_gGEAwr_AYUDF4ACiAN4gQKJA3yCAosDA4MCjAMDhAKOAwOFAo8DA4YCkAMDhwKSAwOIApQDF4kClQN9igKXAwOLApkDF4wCmgN-jQKbAwOOApwDA48CnQMXkAKgA3-RAqEDgwGSAqMDBpMCpAMGlAKnAwaVAqgDBpYCqQMGlwKrAwaYAq0DF5kCrgOEAZoCsAMGmwKyAxecArMDhQGdArQDBp4CtQMGnwK2AxegArkDhgGhAroDigE"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("node:buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AddressScalarFieldEnum: () => AddressScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CourierParcelScalarFieldEnum: () => CourierParcelScalarFieldEnum,
  CourierScalarFieldEnum: () => CourierScalarFieldEnum,
  CustomerScalarFieldEnum: () => CustomerScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  DeliveryAttemptScalarFieldEnum: () => DeliveryAttemptScalarFieldEnum,
  HubScalarFieldEnum: () => HubScalarFieldEnum,
  HubTransferScalarFieldEnum: () => HubTransferScalarFieldEnum,
  JsonNull: () => JsonNull2,
  ModelName: () => ModelName,
  NotificationScalarFieldEnum: () => NotificationScalarFieldEnum,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PricingRuleScalarFieldEnum: () => PricingRuleScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProofOfDeliveryScalarFieldEnum: () => ProofOfDeliveryScalarFieldEnum,
  QueryMode: () => QueryMode,
  ShipmentScalarFieldEnum: () => ShipmentScalarFieldEnum,
  ShipmentStatusHistoryScalarFieldEnum: () => ShipmentStatusHistoryScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  ZoneScalarFieldEnum: () => ZoneScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.10.0",
  engine: "0edf323efd1d98336f3f0a68684b56f689b900d3"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  Address: "Address",
  Courier: "Courier",
  CourierParcel: "CourierParcel",
  Customer: "Customer",
  DeliveryAttempt: "DeliveryAttempt",
  Hub: "Hub",
  HubTransfer: "HubTransfer",
  Notification: "Notification",
  Payment: "Payment",
  PricingRule: "PricingRule",
  ProofOfDelivery: "ProofOfDelivery",
  Shipment: "Shipment",
  ShipmentStatusHistory: "ShipmentStatusHistory",
  User: "User",
  Zone: "Zone"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var AddressScalarFieldEnum = {
  id: "id",
  customerId: "customerId",
  label: "label",
  addressLine: "addressLine",
  city: "city",
  area: "area",
  postalCode: "postalCode",
  latitude: "latitude",
  longitude: "longitude",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CourierScalarFieldEnum = {
  id: "id",
  userId: "userId",
  hubId: "hubId",
  vehicleType: "vehicleType",
  vehicleNumber: "vehicleNumber",
  availabilityStatus: "availabilityStatus",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CourierParcelScalarFieldEnum = {
  id: "id",
  shipmentId: "shipmentId",
  courierId: "courierId",
  assignedBy: "assignedBy",
  status: "status",
  assignedAt: "assignedAt",
  acceptedAt: "acceptedAt",
  completedAt: "completedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CustomerScalarFieldEnum = {
  id: "id",
  userId: "userId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var DeliveryAttemptScalarFieldEnum = {
  id: "id",
  shipmentId: "shipmentId",
  courierId: "courierId",
  attemptNumber: "attemptNumber",
  status: "status",
  failureReason: "failureReason",
  notes: "notes",
  attemptedAt: "attemptedAt",
  createdAt: "createdAt"
};
var HubScalarFieldEnum = {
  id: "id",
  name: "name",
  code: "code",
  zoneId: "zoneId",
  address: "address",
  phone: "phone",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var HubTransferScalarFieldEnum = {
  id: "id",
  shipmentId: "shipmentId",
  fromHubId: "fromHubId",
  toHubId: "toHubId",
  status: "status",
  dispatchedAt: "dispatchedAt",
  receivedAt: "receivedAt",
  createdBy: "createdBy",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var NotificationScalarFieldEnum = {
  id: "id",
  userId: "userId",
  shipmentId: "shipmentId",
  title: "title",
  message: "message",
  type: "type",
  isRead: "isRead",
  createdAt: "createdAt"
};
var PaymentScalarFieldEnum = {
  id: "id",
  shipmentId: "shipmentId",
  amount: "amount",
  currency: "currency",
  provider: "provider",
  transactionId: "transactionId",
  status: "status",
  paidAt: "paidAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PricingRuleScalarFieldEnum = {
  id: "id",
  zoneId: "zoneId",
  deliveryType: "deliveryType",
  minWeight: "minWeight",
  maxWeight: "maxWeight",
  baseCharge: "baseCharge",
  perKgCharge: "perKgCharge",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProofOfDeliveryScalarFieldEnum = {
  id: "id",
  shipmentId: "shipmentId",
  deliveryAttemptId: "deliveryAttemptId",
  recipientName: "recipientName",
  recipientPhone: "recipientPhone",
  imageUrl: "imageUrl",
  signatureUrl: "signatureUrl",
  notes: "notes",
  createdAt: "createdAt"
};
var ShipmentScalarFieldEnum = {
  id: "id",
  trackingNumber: "trackingNumber",
  customerId: "customerId",
  pickupAddressId: "pickupAddressId",
  deliveryAddressId: "deliveryAddressId",
  originHubId: "originHubId",
  destinationHubId: "destinationHubId",
  parcelType: "parcelType",
  weight: "weight",
  description: "description",
  deliveryType: "deliveryType",
  status: "status",
  deliveryCharge: "deliveryCharge",
  paymentStatus: "paymentStatus",
  scheduledPickupAt: "scheduledPickupAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ShipmentStatusHistoryScalarFieldEnum = {
  id: "id",
  shipmentId: "shipmentId",
  status: "status",
  location: "location",
  note: "note",
  updatedBy: "updatedBy",
  createdAt: "createdAt"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  password: "password",
  googleId: "googleId",
  authProvider: "authProvider",
  emailVerified: "emailVerified",
  phone: "phone",
  role: "role",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ZoneScalarFieldEnum = {
  id: "id",
  name: "name",
  code: "code",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/enums.ts
var UserRole = {
  CUSTOMER: "CUSTOMER",
  COURIER: "COURIER",
  HUB_MANAGER: "HUB_MANAGER",
  OPERATIONS_MANAGER: "OPERATIONS_MANAGER",
  ADMIN: "ADMIN"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED"
};
var CourierAvailability = {
  AVAILABLE: "AVAILABLE",
  BUSY: "BUSY",
  OFFLINE: "OFFLINE"
};
var ShipmentStatus = {
  PENDING_APPROVAL: "PENDING_APPROVAL",
  CREATED: "CREATED",
  COURIER_ASSIGNED: "COURIER_ASSIGNED",
  PICKUP_ASSIGNED: "PICKUP_ASSIGNED",
  PICKED_UP: "PICKED_UP",
  AT_ORIGIN_HUB: "AT_ORIGIN_HUB",
  IN_TRANSIT: "IN_TRANSIT",
  AT_DESTINATION_HUB: "AT_DESTINATION_HUB",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  DELIVERY_FAILED: "DELIVERY_FAILED",
  RESCHEDULED: "RESCHEDULED",
  RETURN_INITIATED: "RETURN_INITIATED",
  RETURN_IN_TRANSIT: "RETURN_IN_TRANSIT",
  RETURNED: "RETURNED",
  CANCELLED: "CANCELLED"
};
var AssignmentStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
};
var TransferStatus = {
  PENDING: "PENDING",
  DISPATCHED: "DISPATCHED",
  IN_TRANSIT: "IN_TRANSIT",
  RECEIVED: "RECEIVED",
  CANCELLED: "CANCELLED"
};
var AttemptStatus = {
  SUCCESS: "SUCCESS",
  FAILED: "FAILED"
};
var PaymentStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED"
};
var AuthProvider = {
  GOOGLE: "GOOGLE",
  CREDENTIALS: "CREDENTIALS"
};

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/config/index.ts
import dotenv from "dotenv";
import path2 from "path";
dotenv.config({ path: path2.join(process.cwd(), ".env") });
var config_default = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bak_url: process.env.APP_URL,
  frontend_url: process.env.FRONTEND_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  super_admin_name: process.env.SUPER_ADMIN_NAME,
  super_admin_email: process.env.SUPER_ADMIN_EMAIL,
  super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
  admin_name: process.env.SUPER_ADMIN_NAME,
  admin_email: process.env.SUPER_ADMIN_EMAIL,
  admin_password: process.env.SUPER_ADMIN_PASSWORD,
  admin_phone: process.env.ADMIN_PHONE,
  operations_manager_name: process.env.OPERATIONS_MANAGER_NAME,
  operations_manager_email: process.env.OPERATIONS_MANAGER_EMAIL,
  operations_manager_password: process.env.OPERATIONS_MANAGER_PASSWORD,
  operations_manager_phone: process.env.OPERATIONS_MANAGER_PHONE,
  hub_manager_name: process.env.HUB_MANAGER_NAME,
  hub_manager_email: process.env.HUB_MANAGER_EMAIL,
  hub_manager_password: process.env.HUB_MANAGER_PASSWORD,
  hub_manager_phone: process.env.HUB_MANAGER_PHONE,
  courier_name: process.env.COURIER_NAME,
  courier_email: process.env.COURIER_EMAIL,
  courier_password: process.env.COURIER_PASSWORD,
  courier_phone: process.env.COURIER_PHONE,
  tester_admin_name: process.env.TESTER_ADMIN_NAME,
  tester_admin_email: process.env.TESTER_ADMIN_EMAIL,
  tester_admin_password: process.env.TESTER_ADMIN_PASSWORD,
  tester_doctor_name: process.env.TESTER_DOCTOR_NAME,
  tester_doctor_email: process.env.TESTER_DOCTOR_EMAIL,
  tester_doctor_password: process.env.TESTER_DOCTOR_PASSWORD,
  redis_user: process.env.REDIS_USER,
  redis_password: process.env.REDIS_PASSWORD,
  redis_host: process.env.REDIS_HOST,
  redis_port: process.env.REDIS_PORT,
  smtp_user: process.env.SMTP_USER,
  smtp_password: process.env.SMTP_PASSWORD,
  email_sender: process.env.EMAIL_SENDER,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  bkash_base_url: process.env.BKASH_BASE_URL,
  bkash_username: process.env.BKASH_USERNAME,
  bkash_password: process.env.BKASH_PASSWORD,
  bkash_app_key: process.env.BKASH_APP_KEY,
  bkash_app_secret: process.env.BKASH_APP_SECRET,
  bkash_callback_url: process.env.BKASH_CALLBACK_URL,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  stripe_publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  stripe_currency: process.env.STRIPE_CURRENCY || "bdt"
};

// src/app/utils/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};

// src/app/middleware/globalErrorHandler.ts
var globalErrorHandler = async (err, _req, res, _next) => {
  if (config_default.node_env === "development") {
    console.log("Error from Global Error Handler", err);
  }
  let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  let errorMessage = err.message || "Internal Server Error";
  const errorName = err.name || "Internal Server Error";
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    errorMessage = "You have provided incorrect field type or missing fields";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = httpStatus.BAD_REQUEST, errorMessage = "Duplicate Key Error";
    } else if (err.code === "P2003") {
      statusCode = httpStatus.BAD_REQUEST, errorMessage = "Foreign key constraint failed";
    } else if (err.code === "P2025") {
      statusCode = httpStatus.BAD_REQUEST, errorMessage = "An operation failed because it depends on one or more records that were required but not found.";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = httpStatus.UNAUTHORIZED;
      errorMessage = "Authentication failed against database server. Please Check Your Credentials";
    } else if (err.errorCode === "P1001") {
      statusCode = httpStatus.BAD_REQUEST;
      errorMessage = "Can't reach database server";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    errorMessage = "Error occurred during query execution";
  } else if (err instanceof AppError) {
    errorMessage = err.message;
    statusCode = err.statusCode;
  } else if (err instanceof Error) {
    errorMessage = err.message;
  }
  res.status(statusCode).json({
    success: false,
    statusCode: statusCode || httpStatus.INTERNAL_SERVER_ERROR,
    name: config_default.node_env === "development" ? errorName : "Internal Server Error",
    message: config_default.node_env === "development" ? errorMessage : "Internal Server Error",
    error: config_default.node_env === "development" ? err : void 0,
    stack: config_default.node_env === "development" ? err.stack : void 0
  });
};

// src/app/module/admin/admin.router.ts
import { Router } from "express";

// src/app/middleware/checkAuth.ts
import httpStatus2 from "http-status";

// src/app/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app/utils/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/app/utils/jwtutils.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, expiresIn) => {
  const token = jwt.sign(payload, secret, {
    expiresIn
  });
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const verifiedToken = jwt.verify(token, secret);
    return {
      success: true,
      data: verifiedToken
    };
  } catch (error) {
    console.log("Token verification failed:", error);
    return {
      success: false,
      error: error.message
    };
  }
};
var jwtUtils = {
  createToken,
  verifyToken
};

// src/app/middleware/checkAuth.ts
var auth = (...requiredRoles) => {
  return catchAsync(async (req, res, next) => {
    const token = req.cookies.accessToken ? req.cookies.accessToken : req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization?.split(" ")[1] : req.headers.authorization;
    if (!token) {
      throw new AppError(
        httpStatus2.UNAUTHORIZED,
        "You are not logged in. Please log in to access this resource."
      );
    }
    const verifiedToken = jwtUtils.verifyToken(token, config_default.jwt_access_secret);
    if (!verifiedToken.success) {
      throw new AppError(httpStatus2.UNAUTHORIZED, verifiedToken.error);
    }
    const { email, name, userId, role } = verifiedToken.data;
    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus2.FORBIDDEN,
        "Forbidden. You don't have permission to access this resource."
      );
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        email,
        name,
        role
      }
    });
    if (!user) {
      throw new AppError(
        httpStatus2.UNAUTHORIZED,
        "User not found. Please log in again."
      );
    }
    if (user.status === "SUSPENDED") {
      throw new AppError(
        httpStatus2.FORBIDDEN,
        "Your account has been suspended. Please contact support."
      );
    }
    req.user = {
      email,
      name,
      userId,
      role
    };
    next();
  });
};

// src/app/middleware/validationRequest.ts
import httpStatus3 from "http-status";
var validateRequest = (zodSchema) => {
  return catchAsync((req, res, next) => {
    const payload = req.body ?? {};
    const result = zodSchema.safeParse(payload);
    if (!result.success) {
      console.log(result.error);
      console.log(result.error.issues);
      throw new AppError(
        httpStatus3.BAD_REQUEST,
        result.error.issues[0].message
      );
    }
    req.body = result.data;
    next();
  });
};

// src/app/module/admin/admin.controller.ts
import httpStatus5 from "http-status";

// src/app/utils/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
    meta: data.meta
  });
};

// src/app/module/admin/admin.service.ts
import bcrypt from "bcryptjs";
import httpStatus4 from "http-status";
var getDashboardOverview = async () => {
  const [
    revenueResult,
    totalShipments,
    shipmentStatusCounts,
    userRoleCounts,
    totalHubs,
    totalZones,
    recentActivities
  ] = await Promise.all([
    prisma.payment.aggregate({
      where: { status: PaymentStatus.PAID },
      _sum: { amount: true }
    }),
    prisma.shipment.count(),
    prisma.shipment.groupBy({
      by: ["status"],
      _count: true
    }),
    prisma.user.groupBy({
      by: ["role"],
      _count: true
    }),
    prisma.hub.count({ where: { isActive: true } }),
    prisma.zone.count({ where: { isActive: true } }),
    prisma.shipmentStatusHistory.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        shipment: {
          select: {
            id: true,
            trackingNumber: true,
            status: true
          }
        },
        updater: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    })
  ]);
  const shipmentsByStatus = {};
  for (const item of shipmentStatusCounts) {
    shipmentsByStatus[item.status] = item._count;
  }
  const usersByRole = {};
  for (const item of userRoleCounts) {
    usersByRole[item.role] = item._count;
  }
  return {
    totalRevenue: Number(revenueResult._sum.amount || 0),
    currency: config_default.stripe_currency?.toUpperCase() || "BDT",
    totalShipments,
    shipmentsByStatus,
    usersByRole,
    infrastructure: {
      activeHubs: totalHubs,
      activeZones: totalZones
    },
    recentActivities
  };
};
var getAllUsers = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const whereConditions = {};
  if (query.role) {
    whereConditions.role = query.role;
  }
  if (query.status) {
    whereConditions.status = query.status;
  }
  if (query.searchTerm) {
    whereConditions.OR = [
      { name: { contains: query.searchTerm, mode: "insensitive" } },
      { email: { contains: query.searchTerm, mode: "insensitive" } },
      { phone: { contains: query.searchTerm, mode: "insensitive" } }
    ];
  }
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      omit: { password: true },
      include: {
        customer: true,
        courier: {
          include: {
            hub: {
              select: { id: true, name: true, code: true }
            }
          }
        }
      }
    }),
    prisma.user.count({ where: whereConditions })
  ]);
  return {
    data: users,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getCustomers = async (query) => {
  return getAllUsers({ ...query, role: UserRole.CUSTOMER });
};
var getCouriers = async (query) => {
  return getAllUsers({ ...query, role: UserRole.COURIER });
};
var getHubManagers = async (query) => {
  return getAllUsers({ ...query, role: UserRole.HUB_MANAGER });
};
var getOperationsManagers = async (query) => {
  return getAllUsers({ ...query, role: UserRole.OPERATIONS_MANAGER });
};
var getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    omit: { password: true },
    include: {
      customer: {
        include: {
          addresses: true,
          shipments: {
            take: 5,
            orderBy: { createdAt: "desc" }
          }
        }
      },
      courier: {
        include: {
          hub: true,
          assignments: {
            take: 5,
            orderBy: { assignedAt: "desc" }
          }
        }
      }
    }
  });
  if (!user) {
    throw new AppError(httpStatus4.NOT_FOUND, "User not found.");
  }
  return user;
};
var createStaffUser = async (payload) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: payload.email.toLowerCase() },
        ...payload.phone ? [{ phone: payload.phone }] : []
      ]
    }
  });
  if (existingUser) {
    throw new AppError(
      httpStatus4.CONFLICT,
      "User with this email or phone already exists."
    );
  }
  const saltRounds = Number(config_default.bcrypt_salt_rounds) || 10;
  const hashedPassword = await bcrypt.hash(payload.password, saltRounds);
  if (payload.role === UserRole.COURIER) {
    if (!payload.hubId) {
      throw new AppError(
        httpStatus4.BAD_REQUEST,
        "Hub assignment is required when creating a courier account."
      );
    }
    const hub = await prisma.hub.findUnique({ where: { id: payload.hubId } });
    if (!hub) {
      throw new AppError(httpStatus4.NOT_FOUND, "Assigned Hub not found.");
    }
    const newUser2 = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email.toLowerCase(),
        password: hashedPassword,
        phone: payload.phone || null,
        role: UserRole.COURIER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        courier: {
          create: {
            hubId: hub.id,
            vehicleType: payload.vehicleType || "Motorcycle",
            vehicleNumber: payload.vehicleNumber || "PENDING-REG",
            availabilityStatus: CourierAvailability.AVAILABLE
          }
        }
      },
      omit: { password: true },
      include: { courier: { include: { hub: true } } }
    });
    return newUser2;
  }
  const newUser = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email.toLowerCase(),
      password: hashedPassword,
      phone: payload.phone || null,
      role: payload.role,
      status: UserStatus.ACTIVE,
      emailVerified: true
    },
    omit: { password: true }
  });
  return newUser;
};
var updateUser = async (id, payload) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError(httpStatus4.NOT_FOUND, "User not found.");
  }
  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...payload.name ? { name: payload.name } : {},
      ...payload.phone !== void 0 ? { phone: payload.phone } : {},
      ...payload.status ? { status: payload.status } : {},
      ...payload.role ? { role: payload.role } : {}
    },
    omit: { password: true }
  });
  return updated;
};
var deleteUser = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError(httpStatus4.NOT_FOUND, "User not found.");
  }
  const deactivated = await prisma.user.update({
    where: { id },
    data: { status: UserStatus.INACTIVE },
    omit: { password: true }
  });
  return deactivated;
};
var getAllZones = async () => {
  const zones = await prisma.zone.findMany({
    include: {
      _count: {
        select: { hubs: true, pricingRules: true }
      }
    },
    orderBy: { name: "asc" }
  });
  return zones;
};
var createZone = async (payload) => {
  const existing = await prisma.zone.findUnique({
    where: { code: payload.code.toUpperCase() }
  });
  if (existing) {
    throw new AppError(
      httpStatus4.CONFLICT,
      `Zone with code '${payload.code}' already exists.`
    );
  }
  const zone = await prisma.zone.create({
    data: {
      name: payload.name,
      code: payload.code.toUpperCase(),
      isActive: true
    }
  });
  return zone;
};
var updateZone = async (id, payload) => {
  const zone = await prisma.zone.findUnique({ where: { id } });
  if (!zone) {
    throw new AppError(httpStatus4.NOT_FOUND, "Zone not found.");
  }
  const updated = await prisma.zone.update({
    where: { id },
    data: {
      ...payload.name ? { name: payload.name } : {},
      ...payload.code ? { code: payload.code.toUpperCase() } : {},
      ...payload.isActive !== void 0 ? { isActive: payload.isActive } : {}
    }
  });
  return updated;
};
var deleteZone = async (id) => {
  const zone = await prisma.zone.findUnique({ where: { id } });
  if (!zone) {
    throw new AppError(httpStatus4.NOT_FOUND, "Zone not found.");
  }
  const deactivated = await prisma.zone.update({
    where: { id },
    data: { isActive: false }
  });
  return deactivated;
};
var getAllHubs = async () => {
  const hubs = await prisma.hub.findMany({
    include: {
      zone: true,
      _count: {
        select: {
          couriers: true,
          originShipments: true,
          destinationShipments: true
        }
      }
    },
    orderBy: { name: "asc" }
  });
  return hubs;
};
var createHub = async (payload) => {
  const existing = await prisma.hub.findUnique({
    where: { code: payload.code.toUpperCase() }
  });
  if (existing) {
    throw new AppError(
      httpStatus4.CONFLICT,
      `Hub with code '${payload.code}' already exists.`
    );
  }
  const zone = await prisma.zone.findUnique({ where: { id: payload.zoneId } });
  if (!zone) {
    throw new AppError(httpStatus4.NOT_FOUND, "Zone not found.");
  }
  const hub = await prisma.hub.create({
    data: {
      name: payload.name,
      code: payload.code.toUpperCase(),
      zoneId: payload.zoneId,
      address: payload.address,
      phone: payload.phone || null,
      isActive: true
    },
    include: { zone: true }
  });
  return hub;
};
var updateHub = async (id, payload) => {
  const hub = await prisma.hub.findUnique({ where: { id } });
  if (!hub) {
    throw new AppError(httpStatus4.NOT_FOUND, "Hub not found.");
  }
  const updated = await prisma.hub.update({
    where: { id },
    data: {
      ...payload.name ? { name: payload.name } : {},
      ...payload.code ? { code: payload.code.toUpperCase() } : {},
      ...payload.zoneId ? { zoneId: payload.zoneId } : {},
      ...payload.address ? { address: payload.address } : {},
      ...payload.phone !== void 0 ? { phone: payload.phone } : {},
      ...payload.isActive !== void 0 ? { isActive: payload.isActive } : {}
    },
    include: { zone: true }
  });
  return updated;
};
var deleteHub = async (id) => {
  const hub = await prisma.hub.findUnique({ where: { id } });
  if (!hub) {
    throw new AppError(httpStatus4.NOT_FOUND, "Hub not found.");
  }
  const deactivated = await prisma.hub.update({
    where: { id },
    data: { isActive: false }
  });
  return deactivated;
};
var getAllPricingRules = async () => {
  const rules = await prisma.pricingRule.findMany({
    include: { zone: true },
    orderBy: { createdAt: "desc" }
  });
  return rules;
};
var createPricingRule = async (payload) => {
  const zone = await prisma.zone.findUnique({ where: { id: payload.zoneId } });
  if (!zone) {
    throw new AppError(httpStatus4.NOT_FOUND, "Zone not found.");
  }
  const rule = await prisma.pricingRule.create({
    data: {
      zoneId: payload.zoneId,
      deliveryType: payload.deliveryType || "STANDARD",
      minWeight: payload.minWeight || 0,
      maxWeight: payload.maxWeight,
      baseCharge: payload.baseCharge,
      perKgCharge: payload.perKgCharge || 0,
      isActive: true
    },
    include: { zone: true }
  });
  return rule;
};
var updatePricingRule = async (id, payload) => {
  const existing = await prisma.pricingRule.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(httpStatus4.NOT_FOUND, "Pricing rule not found.");
  }
  const updated = await prisma.pricingRule.update({
    where: { id },
    data: {
      ...payload.minWeight !== void 0 ? { minWeight: payload.minWeight } : {},
      ...payload.maxWeight !== void 0 ? { maxWeight: payload.maxWeight } : {},
      ...payload.baseCharge !== void 0 ? { baseCharge: payload.baseCharge } : {},
      ...payload.perKgCharge !== void 0 ? { perKgCharge: payload.perKgCharge } : {},
      ...payload.isActive !== void 0 ? { isActive: payload.isActive } : {}
    },
    include: { zone: true }
  });
  return updated;
};
var deletePricingRule = async (id) => {
  const existing = await prisma.pricingRule.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(httpStatus4.NOT_FOUND, "Pricing rule not found.");
  }
  const deactivated = await prisma.pricingRule.update({
    where: { id },
    data: { isActive: false }
  });
  return deactivated;
};
var getAllShipments = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const whereConditions = {};
  if (query.status) {
    whereConditions.status = query.status;
  }
  if (query.paymentStatus) {
    whereConditions.paymentStatus = query.paymentStatus;
  }
  if (query.originHubId) {
    whereConditions.originHubId = query.originHubId;
  }
  if (query.destinationHubId) {
    whereConditions.destinationHubId = query.destinationHubId;
  }
  if (query.searchTerm) {
    whereConditions.OR = [
      { trackingNumber: { contains: query.searchTerm, mode: "insensitive" } },
      { description: { contains: query.searchTerm, mode: "insensitive" } }
    ];
  }
  const [shipments, total] = await Promise.all([
    prisma.shipment.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        originHub: true,
        destinationHub: true,
        pickupAddress: true,
        deliveryAddress: true,
        payment: true,
        customer: {
          include: {
            user: {
              select: { id: true, name: true, email: true, phone: true }
            }
          }
        }
      }
    }),
    prisma.shipment.count({ where: whereConditions })
  ]);
  return {
    data: shipments,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getAllPayments = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const whereConditions = {};
  if (query.status) {
    whereConditions.status = query.status;
  }
  if (query.provider) {
    whereConditions.provider = query.provider;
  }
  if (query.searchTerm) {
    whereConditions.OR = [
      { transactionId: { contains: query.searchTerm, mode: "insensitive" } },
      {
        shipment: {
          trackingNumber: { contains: query.searchTerm, mode: "insensitive" }
        }
      }
    ];
  }
  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        shipment: {
          select: {
            id: true,
            trackingNumber: true,
            status: true,
            deliveryCharge: true
          }
        }
      }
    }),
    prisma.payment.count({ where: whereConditions })
  ]);
  return {
    data: payments,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getRevenueAnalytics = async () => {
  const [paidSummary, providerBreakdown] = await Promise.all([
    prisma.payment.aggregate({
      where: { status: PaymentStatus.PAID },
      _sum: { amount: true },
      _count: true
    }),
    prisma.payment.groupBy({
      by: ["provider"],
      where: { status: PaymentStatus.PAID },
      _sum: { amount: true },
      _count: true
    })
  ]);
  return {
    totalPaidRevenue: Number(paidSummary._sum.amount || 0),
    totalPaidTransactions: paidSummary._count,
    breakdownByProvider: providerBreakdown.map((item) => ({
      provider: item.provider,
      totalRevenue: Number(item._sum.amount || 0),
      transactionsCount: item._count
    }))
  };
};
var getPerformanceAnalytics = async () => {
  const [
    totalAttempts,
    successAttempts,
    failedAttempts,
    deliveredShipments,
    failedShipments
  ] = await Promise.all([
    prisma.deliveryAttempt.count(),
    prisma.deliveryAttempt.count({ where: { status: AttemptStatus.SUCCESS } }),
    prisma.deliveryAttempt.count({ where: { status: AttemptStatus.FAILED } }),
    prisma.shipment.count({ where: { status: ShipmentStatus.DELIVERED } }),
    prisma.shipment.count({
      where: { status: ShipmentStatus.DELIVERY_FAILED }
    })
  ]);
  const successRate = totalAttempts > 0 ? (successAttempts / totalAttempts * 100).toFixed(2) : "0.00";
  return {
    totalDeliveryAttempts: totalAttempts,
    successfulAttempts: successAttempts,
    failedAttempts,
    deliverySuccessRatePercent: `${successRate}%`,
    deliveredShipmentsCount: deliveredShipments,
    currentlyFailedShipmentsCount: failedShipments
  };
};
var getHubVolumeReport = async () => {
  const hubs = await prisma.hub.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: {
          originShipments: true,
          destinationShipments: true,
          transfersFrom: true,
          transfersTo: true,
          couriers: true
        }
      }
    },
    orderBy: { name: "asc" }
  });
  return hubs.map((hub) => ({
    hubId: hub.id,
    name: hub.name,
    code: hub.code,
    activeCouriers: hub._count.couriers,
    inboundDispatched: hub._count.originShipments,
    outboundDeliveries: hub._count.destinationShipments,
    transfersDispatched: hub._count.transfersFrom,
    transfersReceived: hub._count.transfersTo
  }));
};
var getSettings = async () => {
  return {
    environment: config_default.node_env || "development",
    currency: config_default.stripe_currency?.toUpperCase() || "BDT",
    stripeConfigured: Boolean(config_default.stripe_secret_key),
    redisConfigured: Boolean(config_default.redis_host),
    emailSenderConfigured: Boolean(config_default.email_sender),
    backendUrl: config_default.bak_url,
    frontendUrl: config_default.frontend_url
  };
};
var AdminService = {
  getDashboardOverview,
  getAllUsers,
  getCustomers,
  getCouriers,
  getHubManagers,
  getOperationsManagers,
  getUserById,
  createStaffUser,
  updateUser,
  deleteUser,
  getAllZones,
  createZone,
  updateZone,
  deleteZone,
  getAllHubs,
  createHub,
  updateHub,
  deleteHub,
  getAllPricingRules,
  createPricingRule,
  updatePricingRule,
  deletePricingRule,
  getAllShipments,
  getAllPayments,
  getRevenueAnalytics,
  getPerformanceAnalytics,
  getHubVolumeReport,
  getSettings
};

// src/app/module/admin/admin.controller.ts
var getDashboardOverview2 = catchAsync(
  async (_req, res) => {
    const result = await AdminService.getDashboardOverview();
    sendResponse(res, {
      statusCode: httpStatus5.OK,
      success: true,
      message: "Admin dashboard overview retrieved successfully.",
      data: result
    });
  }
);
var getAllUsers2 = catchAsync(async (req, res) => {
  const result = await AdminService.getAllUsers(req.query);
  sendResponse(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "Users retrieved successfully.",
    data: result.data,
    meta: result.meta
  });
});
var getCustomers2 = catchAsync(async (req, res) => {
  const result = await AdminService.getCustomers(req.query);
  sendResponse(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "Customers retrieved successfully.",
    data: result.data,
    meta: result.meta
  });
});
var getCouriers2 = catchAsync(async (req, res) => {
  const result = await AdminService.getCouriers(req.query);
  sendResponse(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "Couriers retrieved successfully.",
    data: result.data,
    meta: result.meta
  });
});
var getHubManagers2 = catchAsync(async (req, res) => {
  const result = await AdminService.getHubManagers(req.query);
  sendResponse(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "Hub managers retrieved successfully.",
    data: result.data,
    meta: result.meta
  });
});
var getOperationsManagers2 = catchAsync(
  async (req, res) => {
    const result = await AdminService.getOperationsManagers(req.query);
    sendResponse(res, {
      statusCode: httpStatus5.OK,
      success: true,
      message: "Operations managers retrieved successfully.",
      data: result.data,
      meta: result.meta
    });
  }
);
var getUserById2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminService.getUserById(id);
  sendResponse(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "User profile details retrieved successfully.",
    data: result
  });
});
var createStaffUser2 = catchAsync(async (req, res) => {
  const result = await AdminService.createStaffUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus5.CREATED,
    success: true,
    message: "Staff user account created successfully.",
    data: result
  });
});
var updateUser2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminService.updateUser(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "User updated successfully.",
    data: result
  });
});
var deleteUser2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminService.deleteUser(id);
  sendResponse(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "User deactivated successfully.",
    data: result
  });
});
var getAllZones2 = catchAsync(async (_req, res) => {
  const result = await AdminService.getAllZones();
  sendResponse(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "Zones retrieved successfully.",
    data: result
  });
});
var createZone2 = catchAsync(async (req, res) => {
  const result = await AdminService.createZone(req.body);
  sendResponse(res, {
    statusCode: httpStatus5.CREATED,
    success: true,
    message: "Zone created successfully.",
    data: result
  });
});
var updateZone2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminService.updateZone(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "Zone updated successfully.",
    data: result
  });
});
var deleteZone2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminService.deleteZone(id);
  sendResponse(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "Zone deactivated successfully.",
    data: result
  });
});
var getAllHubs2 = catchAsync(async (_req, res) => {
  const result = await AdminService.getAllHubs();
  sendResponse(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "Hubs retrieved successfully.",
    data: result
  });
});
var createHub2 = catchAsync(async (req, res) => {
  const result = await AdminService.createHub(req.body);
  sendResponse(res, {
    statusCode: httpStatus5.CREATED,
    success: true,
    message: "Hub created successfully.",
    data: result
  });
});
var updateHub2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminService.updateHub(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "Hub updated successfully.",
    data: result
  });
});
var deleteHub2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminService.deleteHub(id);
  sendResponse(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "Hub deactivated successfully.",
    data: result
  });
});
var getAllPricingRules2 = catchAsync(async (_req, res) => {
  const result = await AdminService.getAllPricingRules();
  sendResponse(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "Pricing rules retrieved successfully.",
    data: result
  });
});
var createPricingRule2 = catchAsync(async (req, res) => {
  const result = await AdminService.createPricingRule(req.body);
  sendResponse(res, {
    statusCode: httpStatus5.CREATED,
    success: true,
    message: "Pricing rule created successfully.",
    data: result
  });
});
var updatePricingRule2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminService.updatePricingRule(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "Pricing rule updated successfully.",
    data: result
  });
});
var deletePricingRule2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminService.deletePricingRule(id);
  sendResponse(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "Pricing rule deactivated successfully.",
    data: result
  });
});
var getAllShipments2 = catchAsync(async (req, res) => {
  const result = await AdminService.getAllShipments(req.query);
  sendResponse(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "Global shipments retrieved successfully.",
    data: result.data,
    meta: result.meta
  });
});
var getAllPayments2 = catchAsync(async (req, res) => {
  const result = await AdminService.getAllPayments(req.query);
  sendResponse(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "Global payments retrieved successfully.",
    data: result.data,
    meta: result.meta
  });
});
var getRevenueAnalytics2 = catchAsync(async (_req, res) => {
  const result = await AdminService.getRevenueAnalytics();
  sendResponse(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "Revenue analytics retrieved successfully.",
    data: result
  });
});
var getPerformanceAnalytics2 = catchAsync(
  async (_req, res) => {
    const result = await AdminService.getPerformanceAnalytics();
    sendResponse(res, {
      statusCode: httpStatus5.OK,
      success: true,
      message: "Performance analytics retrieved successfully.",
      data: result
    });
  }
);
var getHubVolumeReport2 = catchAsync(async (_req, res) => {
  const result = await AdminService.getHubVolumeReport();
  sendResponse(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "Hub volume reports retrieved successfully.",
    data: result
  });
});
var getSettings2 = catchAsync(async (_req, res) => {
  const result = await AdminService.getSettings();
  sendResponse(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "Platform settings retrieved successfully.",
    data: result
  });
});
var AdminController = {
  getDashboardOverview: getDashboardOverview2,
  getAllUsers: getAllUsers2,
  getCustomers: getCustomers2,
  getCouriers: getCouriers2,
  getHubManagers: getHubManagers2,
  getOperationsManagers: getOperationsManagers2,
  getUserById: getUserById2,
  createStaffUser: createStaffUser2,
  updateUser: updateUser2,
  deleteUser: deleteUser2,
  getAllZones: getAllZones2,
  createZone: createZone2,
  updateZone: updateZone2,
  deleteZone: deleteZone2,
  getAllHubs: getAllHubs2,
  createHub: createHub2,
  updateHub: updateHub2,
  deleteHub: deleteHub2,
  getAllPricingRules: getAllPricingRules2,
  createPricingRule: createPricingRule2,
  updatePricingRule: updatePricingRule2,
  deletePricingRule: deletePricingRule2,
  getAllShipments: getAllShipments2,
  getAllPayments: getAllPayments2,
  getRevenueAnalytics: getRevenueAnalytics2,
  getPerformanceAnalytics: getPerformanceAnalytics2,
  getHubVolumeReport: getHubVolumeReport2,
  getSettings: getSettings2
};

// src/app/module/admin/admin.validation.ts
import { z } from "zod";
var CreateStaffUserZodSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").max(255),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  phone: z.string().max(50).optional(),
  role: z.nativeEnum(UserRole, {
    message: "Valid staff user role is required"
  }),
  hubId: z.string().uuid("Invalid hub ID").optional(),
  vehicleType: z.string().max(50).optional(),
  vehicleNumber: z.string().max(50).optional()
});
var UpdateUserZodSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  phone: z.string().max(50).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  role: z.nativeEnum(UserRole).optional()
});
var CreateHubZodSchema = z.object({
  name: z.string().min(2, "Hub name is required").max(150),
  code: z.string().min(2, "Hub code is required").max(50),
  zoneId: z.string().uuid("Valid zone ID is required"),
  address: z.string().min(3, "Address is required"),
  phone: z.string().max(50).optional()
});
var UpdateHubZodSchema = z.object({
  name: z.string().min(2).max(150).optional(),
  code: z.string().min(2).max(50).optional(),
  zoneId: z.string().uuid().optional(),
  address: z.string().min(3).optional(),
  phone: z.string().max(50).optional(),
  isActive: z.boolean().optional()
});
var CreateZoneZodSchema = z.object({
  name: z.string().min(2, "Zone name is required").max(100),
  code: z.string().min(2, "Zone code is required").max(50)
});
var UpdateZoneZodSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  code: z.string().min(2).max(50).optional(),
  isActive: z.boolean().optional()
});
var CreatePricingRuleZodSchema = z.object({
  zoneId: z.string().uuid("Valid zone ID is required"),
  deliveryType: z.string().max(50).optional().default("STANDARD"),
  minWeight: z.number().nonnegative().optional().default(0),
  maxWeight: z.number().positive("Max weight must be positive"),
  baseCharge: z.number().positive("Base charge must be positive"),
  perKgCharge: z.number().nonnegative().optional().default(0)
});
var UpdatePricingRuleZodSchema = z.object({
  minWeight: z.number().nonnegative().optional(),
  maxWeight: z.number().positive().optional(),
  baseCharge: z.number().positive().optional(),
  perKgCharge: z.number().nonnegative().optional(),
  isActive: z.boolean().optional()
});
var AdminValidation = {
  CreateStaffUserZodSchema,
  UpdateUserZodSchema,
  CreateHubZodSchema,
  UpdateHubZodSchema,
  CreateZoneZodSchema,
  UpdateZoneZodSchema,
  CreatePricingRuleZodSchema,
  UpdatePricingRuleZodSchema
};

// src/app/module/admin/admin.router.ts
var router = Router();
router.use(auth(UserRole.ADMIN));
router.get("/dashboard/overview", AdminController.getDashboardOverview);
router.get("/users", AdminController.getAllUsers);
router.post(
  "/users",
  validateRequest(AdminValidation.CreateStaffUserZodSchema),
  AdminController.createStaffUser
);
router.get("/users/:id", AdminController.getUserById);
router.patch(
  "/users/:id",
  validateRequest(AdminValidation.UpdateUserZodSchema),
  AdminController.updateUser
);
router.delete("/users/:id", AdminController.deleteUser);
router.get("/customers", AdminController.getCustomers);
router.get("/couriers", AdminController.getCouriers);
router.get("/hub-managers", AdminController.getHubManagers);
router.get("/operations-managers", AdminController.getOperationsManagers);
router.get("/zones", AdminController.getAllZones);
router.post(
  "/zones",
  validateRequest(AdminValidation.CreateZoneZodSchema),
  AdminController.createZone
);
router.patch(
  "/zones/:id",
  validateRequest(AdminValidation.UpdateZoneZodSchema),
  AdminController.updateZone
);
router.delete("/zones/:id", AdminController.deleteZone);
router.get("/hubs", AdminController.getAllHubs);
router.post(
  "/hubs",
  validateRequest(AdminValidation.CreateHubZodSchema),
  AdminController.createHub
);
router.patch(
  "/hubs/:id",
  validateRequest(AdminValidation.UpdateHubZodSchema),
  AdminController.updateHub
);
router.delete("/hubs/:id", AdminController.deleteHub);
router.get("/pricing", AdminController.getAllPricingRules);
router.post(
  "/pricing",
  validateRequest(AdminValidation.CreatePricingRuleZodSchema),
  AdminController.createPricingRule
);
router.patch(
  "/pricing/:id",
  validateRequest(AdminValidation.UpdatePricingRuleZodSchema),
  AdminController.updatePricingRule
);
router.delete("/pricing/:id", AdminController.deletePricingRule);
router.get("/shipments", AdminController.getAllShipments);
router.get("/payments", AdminController.getAllPayments);
router.get("/analytics/revenue", AdminController.getRevenueAnalytics);
router.get("/analytics/performance", AdminController.getPerformanceAnalytics);
router.get("/reports/hub-volume", AdminController.getHubVolumeReport);
router.get("/settings", AdminController.getSettings);
var AdminRoutes = router;

// src/app/module/auth/auth.router.ts
import { Router as Router2 } from "express";

// src/generated/prisma/internal/prismaNamespaceBrowser.ts
import * as runtime3 from "@prisma/client/runtime/index-browser";
var NullTypes4 = {
  DbNull: runtime3.NullTypes.DbNull,
  JsonNull: runtime3.NullTypes.JsonNull,
  AnyNull: runtime3.NullTypes.AnyNull
};
var TransactionIsolationLevel2 = runtime3.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});

// src/app/module/auth/auth.controller.ts
import httpStatus7 from "http-status";

// src/app/module/auth/auth.service.ts
import bcrypt2 from "bcryptjs";
import crypto from "crypto";
import ejs from "ejs";
import httpStatus6 from "http-status";
import path3 from "path";

// src/app/lib/googleOAuth.ts
import { OAuth2Client } from "google-auth-library";
var googleClient = new OAuth2Client({
  client_id: config_default.google_client_id
});
var googleOAuth_default = googleClient;

// src/app/lib/nodemailer.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config_default.smtp_user,
    pass: config_default.smtp_password
  }
});

// src/app/lib/redis.ts
import { createClient } from "redis";
var redisClient = createClient({
  username: config_default.redis_user,
  password: config_default.redis_password,
  socket: {
    host: config_default.redis_host,
    port: Number(config_default.redis_port)
  }
});

// src/app/module/auth/auth.service.ts
var registerCustomer = async (payload) => {
  const { name, password } = payload;
  const email = payload.email.trim().toLowerCase();
  const isUserExists = await prisma.user.findUnique({
    where: { email }
  });
  if (isUserExists) {
    throw new AppError(
      httpStatus6.CONFLICT,
      "User with this email already exists"
    );
  }
  const hashedPassword = await bcrypt2.hash(password, 8);
  const expirationSeconds = 5 * 60;
  const otpKey = `customer-registration-otp:${email}`;
  const otpValue = crypto.randomInt(1e5, 1e6).toString();
  await redisClient.set(otpKey, otpValue, {
    expiration: {
      type: "EX",
      value: expirationSeconds
    }
  });
  const customerRegistrationKey = `customer-registration-data:${email}`;
  const redisUserDataPayload = {
    name,
    email,
    password: hashedPassword
  };
  await redisClient.set(
    customerRegistrationKey,
    JSON.stringify(redisUserDataPayload),
    {
      expiration: {
        type: "EX",
        value: expirationSeconds
      }
    }
  );
  const tempatePath = path3.join(
    process.cwd(),
    "src/app/templates/registration-user-otp.ejs"
  );
  const templateData = {
    name,
    email,
    otp: otpValue,
    expirationMinutes: expirationSeconds / 60
  };
  const html = await ejs.renderFile(tempatePath, templateData);
  await transporter.sendMail({
    from: config_default.email_sender,
    to: email,
    subject: "Email Verification",
    html
  });
};
var verifyCustomerEmail = async (payload) => {
  const otp = payload.otp;
  const email = payload.email.trim().toLowerCase();
  const isUserExist = await prisma.user.findUnique({
    where: { email }
  });
  if (isUserExist?.status === "SUSPENDED") {
    throw new AppError(httpStatus6.FORBIDDEN, "User is SUSPENDED");
  }
  if (isUserExist?.emailVerified) {
    throw new AppError(httpStatus6.CONFLICT, "Email ALready Verified");
  }
  if (isUserExist?.status && isUserExist?.status === "INACTIVE") {
    throw new AppError(httpStatus6.FORBIDDEN, "User is INACTIVE");
  }
  const otpKey = `customer-registration-otp:${email}`;
  const redisOtp = await redisClient.get(otpKey);
  if (!redisOtp) {
    throw new AppError(httpStatus6.BAD_REQUEST, "Invalid OTP");
  }
  if (redisOtp !== otp) {
    throw new AppError(httpStatus6.BAD_REQUEST, "OTP Does Not Match");
  }
  await redisClient.del(otpKey);
  const customerRegistrationKey = `customer-registration-data:${email}`;
  const redisCustomerData = await redisClient.get(customerRegistrationKey);
  if (!redisCustomerData) {
    throw new AppError(httpStatus6.NOT_FOUND, "Customer Doesnt Exist");
  }
  const customerPayload = JSON.parse(redisCustomerData);
  console.log("Customer Payload:", customerPayload);
  const createdUser = await prisma.user.create({
    data: {
      name: customerPayload.name,
      email: customerPayload.email,
      password: customerPayload.password,
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      customer: {
        create: {}
      }
    },
    omit: { password: true },
    include: { customer: true }
  });
  await redisClient.del(customerRegistrationKey);
  const tempatePath = path3.join(
    process.cwd(),
    "src/app/templates/customer-welcome-email.ejs"
  );
  const templateData = {
    name: createdUser.name
  };
  const html = await ejs.renderFile(tempatePath, templateData);
  await transporter.sendMail({
    from: config_default.email_sender,
    to: email,
    subject: "Welcome To PH Healthcare System",
    // text : `Your OTP is ${otp}`
    // html: `<h1>Your OTP is ${otp}</h1>`
    html
  });
  const { customer, ...user } = createdUser;
  const jwtPayload = {
    userId: user.id.toString(),
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    user,
    customer,
    accessToken,
    refreshToken: refreshToken3
  };
};
var loginUser = async (payload) => {
  const { password } = payload;
  const email = payload.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email }
  });
  if (!user) {
    throw new AppError(httpStatus6.NOT_FOUND, "User Not Found");
  }
  if (user.status === "SUSPENDED") {
    throw new AppError(httpStatus6.FORBIDDEN, "User is Suspended");
  }
  if (!user.emailVerified) {
    throw new AppError(httpStatus6.FORBIDDEN, "User Not Verified");
  }
  if (user.status && user.status === "INACTIVE") {
    throw new AppError(httpStatus6.FORBIDDEN, "User is Inactive");
  }
  if (user.password === null && user.googleId !== null) {
    throw new AppError(
      httpStatus6.BAD_REQUEST,
      "User Already Has Account Registered With Google. Try To Login With Google."
    );
  }
  const isPasswordMatched = await bcrypt2.compare(
    password,
    user.password
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus6.UNAUTHORIZED, "Invalid credentials");
  }
  const jwtPayload = {
    userId: user.id.toString(),
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    accessToken,
    refreshToken: refreshToken3
  };
};
var refreshToken = async (token) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(
    token,
    config_default.jwt_refresh_secret
  );
  if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
    throw new AppError(
      httpStatus6.UNAUTHORIZED,
      config_default.node_env === "development" ? verifiedRefreshToken.error : "Invalid refresh token"
    );
  }
  const data = verifiedRefreshToken.data;
  const user = await prisma.user.findUnique({
    where: { id: data.userId }
  });
  if (!user || user.status === UserStatus.SUSPENDED || user.status !== UserStatus.ACTIVE) {
    throw new AppError(
      httpStatus6.UNAUTHORIZED,
      "User is inactive or not found"
    );
  }
  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    accessToken,
    refreshToken: refreshToken3
  };
};
var googleLogin = async (payload) => {
  let googleIdTokenPayload = null;
  try {
    const ticket = await googleOAuth_default.verifyIdToken({
      idToken: payload.idToken,
      audience: config_default.google_client_id
    });
    googleIdTokenPayload = ticket.getPayload();
  } catch (error) {
    console.log("Error verifying Google ID token:", error);
    throw new Error("Failed to verify Google ID token");
  }
  if (!googleIdTokenPayload) {
    throw new Error("Failed to verify Google ID token");
  }
  if (!googleIdTokenPayload) {
    throw new AppError(
      httpStatus6.UNAUTHORIZED,
      "Invalid Or Expired Google Id Token"
    );
  }
  if (!googleIdTokenPayload.email) {
    throw new AppError(httpStatus6.BAD_REQUEST, "Google Email Not Found");
  }
  if (!googleIdTokenPayload.name) {
    throw new AppError(
      httpStatus6.BAD_REQUEST,
      "Google Email User Name Not Found"
    );
  }
  const ifCustomerExistWithGoogleAuth = await prisma.user.findUnique({
    where: {
      email: googleIdTokenPayload.email,
      role: UserRole.CUSTOMER,
      googleId: googleIdTokenPayload.sub
    }
  });
  let user = ifCustomerExistWithGoogleAuth;
  if (!ifCustomerExistWithGoogleAuth) {
    const ifCustomerExistWithCredentials = await prisma.user.findUnique({
      where: {
        email: googleIdTokenPayload.email,
        role: UserRole.CUSTOMER,
        authProvider: AuthProvider.CREDENTIALS
      }
    });
    if (ifCustomerExistWithCredentials) {
      if (!ifCustomerExistWithCredentials.emailVerified) {
        throw new AppError(httpStatus6.FORBIDDEN, "Email Not Verified");
      }
      if (ifCustomerExistWithCredentials.status === UserStatus.SUSPENDED) {
        throw new AppError(httpStatus6.FORBIDDEN, "User Is Suspended");
      }
      if (ifCustomerExistWithCredentials.status === UserStatus.INACTIVE) {
        throw new AppError(httpStatus6.FORBIDDEN, "User Is Deleted");
      }
      user = await prisma.user.update({
        where: {
          id: ifCustomerExistWithCredentials?.id
        },
        data: {
          googleId: googleIdTokenPayload.sub
        }
      });
    } else {
      user = await prisma.user.create({
        data: {
          name: googleIdTokenPayload.name,
          email: googleIdTokenPayload.email,
          role: UserRole.CUSTOMER,
          googleId: googleIdTokenPayload.sub,
          authProvider: AuthProvider.GOOGLE,
          emailVerified: true,
          customer: {
            create: {}
          }
        }
      });
    }
  }
  if (!user) {
    throw new AppError(httpStatus6.NOT_FOUND, "User Not Found");
  }
  if (user.status === UserStatus.INACTIVE) {
    throw new AppError(httpStatus6.FORBIDDEN, "User Is Inactive");
  }
  if (user.status === UserStatus.SUSPENDED) {
    throw new AppError(httpStatus6.FORBIDDEN, "User Is Suspended");
  }
  const jwtPayload = {
    userId: user.id.toString(),
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    accessToken,
    refreshToken: refreshToken3
  };
};
var getMe = async (user) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: user.userId
    },
    omit: {
      password: true
    }
  });
  if (!isUserExists) {
    throw new AppError(httpStatus6.NOT_FOUND, "User not found");
  }
  return isUserExists;
};
var forgotPassword = async (payload) => {
  const { email } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExist) {
    throw new AppError(httpStatus6.NOT_FOUND, "User Does Not Exist!");
  }
  if (isUserExist.status === "SUSPENDED") {
    throw new AppError(httpStatus6.FORBIDDEN, "User is Suspended");
  }
  if (!isUserExist.emailVerified) {
    throw new AppError(httpStatus6.FORBIDDEN, "User Not Verified");
  }
  if (isUserExist.status && isUserExist.status === "INACTIVE") {
    throw new AppError(httpStatus6.FORBIDDEN, "User is Inactive");
  }
  if (isUserExist.googleId && isUserExist.authProvider === "GOOGLE") {
    throw new AppError(httpStatus6.BAD_REQUEST, "User Has Account With Google");
  }
  const otp = crypto.randomInt(1e5, 1e6).toString();
  const key = `forgor-password-otp:${isUserExist.email}`;
  const expirationSeconds = 5 * 60;
  await redisClient.set(key, otp, {
    expiration: {
      type: "EX",
      value: expirationSeconds
    }
  });
  const tempatePath = path3.join(
    process.cwd(),
    "src/app/templates/forgotPassword.ejs"
  );
  const templateData = {
    name: isUserExist.name,
    otp,
    expirationMinutes: expirationSeconds / 60
  };
  const html = await ejs.renderFile(tempatePath, templateData);
  await transporter.sendMail({
    from: config_default.email_sender,
    to: isUserExist.email,
    subject: "Forgot Password",
    // text : `Your OTP is ${otp}`
    // html: `<h1>Your OTP is ${otp}</h1>`
    html
  });
};
var resetPassword = async (payload) => {
  const { email, otp, newPassword } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExist) {
    throw new AppError(httpStatus6.NOT_FOUND, "User Does Not Exist!");
  }
  if (isUserExist.status === "SUSPENDED") {
    throw new AppError(httpStatus6.FORBIDDEN, "User is Suspended");
  }
  if (!isUserExist.emailVerified) {
    throw new AppError(httpStatus6.FORBIDDEN, "User Not Verified");
  }
  if (isUserExist.status && isUserExist.status === "INACTIVE") {
    throw new AppError(httpStatus6.FORBIDDEN, "User is Inactive");
  }
  if (isUserExist.googleId && isUserExist.authProvider === "GOOGLE") {
    throw new AppError(httpStatus6.BAD_REQUEST, "User Has Account With Google");
  }
  const key = `forgor-password-otp:${isUserExist.email}`;
  const redisOtp = await redisClient.get(key);
  if (!redisOtp) {
    throw new AppError(httpStatus6.BAD_REQUEST, "Invalid OTP");
  }
  if (redisOtp !== otp) {
    throw new AppError(httpStatus6.BAD_REQUEST, "OTP Does Not Match");
  }
  const hashedNewPassword = await bcrypt2.hash(
    newPassword,
    Number(config_default.bcrypt_salt_rounds)
  );
  await prisma.user.update({
    where: {
      email: isUserExist.email
    },
    data: {
      password: hashedNewPassword
    }
  });
  await redisClient.del([key]);
  const tempatePath = path3.join(
    process.cwd(),
    "src/app/templates/reset-password-success.ejs"
  );
  const templateData = {
    name: isUserExist.name
  };
  const html = await ejs.renderFile(tempatePath, templateData);
  await transporter.sendMail({
    from: config_default.email_sender,
    to: isUserExist.email,
    subject: "Password Changed",
    html
  });
};
var AuthService = {
  googleLogin,
  registerCustomer,
  verifyCustomerEmail,
  forgotPassword,
  resetPassword,
  loginUser,
  refreshToken,
  getMe
};

// src/app/module/auth/auth.controller.ts
var registerCustomerController = catchAsync(
  async (req, res) => {
    const payload = req.body;
    await AuthService.registerCustomer(payload);
    sendResponse(res, {
      statusCode: httpStatus7.CREATED,
      success: true,
      message: "OTP sent successfully",
      data: null
    });
  }
);
var verifyCustomerEmailController = catchAsync(
  async (req, res) => {
    const payload = req.body;
    const result = await AuthService.verifyCustomerEmail(payload);
    const { accessToken, refreshToken: refreshToken3, user, customer } = result;
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1e3 * 60 * 60 * 24
      // 24 hour or 1 day
    });
    res.cookie("refreshToken", refreshToken3, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1e3 * 60 * 60 * 24 * 7
      // 7 days
    });
    sendResponse(res, {
      statusCode: httpStatus7.CREATED,
      success: true,
      message: "Email Verified Successfully",
      data: {
        accessToken,
        refreshToken: refreshToken3,
        user,
        customer
      }
    });
  }
);
var loginUser2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.loginUser(payload);
  const { accessToken, refreshToken: refreshToken3 } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24
    // 24 hour or 1 day
  });
  res.cookie("refreshToken", refreshToken3, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 7
    // 7 days
  });
  sendResponse(res, {
    statusCode: httpStatus7.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      accessToken,
      refreshToken: refreshToken3
    }
  });
});
var refreshToken2 = catchAsync(async (req, res) => {
  if (!req.cookies.refreshToken) {
    throw new AppError(httpStatus7.UNAUTHORIZED, "Refresh token is missing");
  }
  const result = await AuthService.refreshToken(req.cookies.refreshToken);
  const { accessToken, refreshToken: newRefreshToken } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24
    // 24 hour or 1 day
  });
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 7
    // 7 days
  });
  sendResponse(res, {
    statusCode: httpStatus7.OK,
    success: true,
    message: "New tokens generated successfully",
    data: {
      accessToken,
      refreshToken: newRefreshToken
    }
  });
});
var getMe2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus7.UNAUTHORIZED,
      "User information is missing in the request"
    );
  }
  const result = await AuthService.getMe(user);
  sendResponse(res, {
    statusCode: httpStatus7.OK,
    success: true,
    message: "User profile fetched successfully",
    data: result
  });
});
var googleLogin2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.googleLogin(payload);
  const { accessToken, refreshToken: refreshToken3 } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24
    // 24 hour or 1 day
  });
  res.cookie("refreshToken", refreshToken3, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 7
    // 7 days
  });
  sendResponse(res, {
    statusCode: httpStatus7.OK,
    success: true,
    message: "New tokens generated successfully",
    data: {
      accessToken,
      refreshToken: refreshToken3
    }
  });
});
var forgotPassword2 = catchAsync(async (req, res) => {
  const payload = req.body;
  await AuthService.forgotPassword(payload);
  sendResponse(res, {
    statusCode: httpStatus7.OK,
    success: true,
    message: `OTP Sent To Email : ${payload.email}`,
    data: null
  });
});
var resetPassword2 = catchAsync(async (req, res) => {
  const payload = req.body;
  await AuthService.resetPassword(payload);
  sendResponse(res, {
    statusCode: httpStatus7.OK,
    success: true,
    message: "Password Changed Successfully",
    data: null
  });
});
var AuthController = {
  googleLogin: googleLogin2,
  registerCustomerController,
  verifyCustomerEmailController,
  loginUser: loginUser2,
  forgotPassword: forgotPassword2,
  resetPassword: resetPassword2,
  refreshToken: refreshToken2,
  getMe: getMe2
};

// src/app/module/auth/auth.validation.ts
import z2 from "zod";
var CustomerRegistrationZodSchema = z2.object({
  name: z2.string("Not A String!!!!!").min(3, "Name must atleast 3 characters long!!!").max(100, "Name must be less than 100 characters long!!!"),
  email: z2.email("Not email!!"),
  password: z2.string().min(8, "Password Must Minimum 8 Characters Long.").regex(/[a-z]/, "Password must contain atleast 1 Lowercase Letter").regex(/[A-Z]/, "Password must contain atleast 1 Uppercase Letter").regex(/[0-9]/, "Password must contain atleast 1 Number").regex(/[^A-Za-z0-9]/, "Password must contain atleast 1 Special Character")
});
var CustomerEmailVerifyZodSchema = z2.object({
  email: z2.email("Not email!!"),
  otp: z2.string().length(6)
});
var LoginZodSchema = z2.object({
  email: z2.email(),
  password: z2.string().min(8, "Password Must Minimum 8 Characters Long.").regex(/[a-z]/, "Password must contain atleast 1 Lowercase Letter").regex(/[A-Z]/, "Password must contain atleast 1 Uppercase Letter").regex(/[0-9]/, "Password must contain atleast 1 Number").regex(/[^A-Za-z0-9]/, "Password must contain atleast 1 Special Character")
});
var ForgotPasswordZodSchema = z2.object({
  email: z2.email()
});
var ResetPasswordZodSchema = z2.object({
  email: z2.email(),
  newPassword: z2.string().min(8, "Password Must Minimum 8 Characters Long.").regex(/[a-z]/, "Password must contain atleast 1 Lowercase Letter").regex(/[A-Z]/, "Password must contain atleast 1 Uppercase Letter").regex(/[0-9]/, "Password must contain atleast 1 Number").regex(/[^A-Za-z0-9]/, "Password must contain atleast 1 Special Character"),
  otp: z2.string().length(6)
});
var UserValidation = {
  CustomerRegistrationZodSchema,
  CustomerEmailVerifyZodSchema,
  LoginZodSchema,
  ForgotPasswordZodSchema,
  ResetPasswordZodSchema
};

// src/app/module/auth/auth.router.ts
var router2 = Router2();
router2.post(
  "/register",
  validateRequest(UserValidation.CustomerRegistrationZodSchema),
  AuthController.registerCustomerController
);
router2.post(
  "/verify-email",
  validateRequest(UserValidation.CustomerEmailVerifyZodSchema),
  AuthController.verifyCustomerEmailController
);
router2.post(
  "/login",
  validateRequest(UserValidation.LoginZodSchema),
  AuthController.loginUser
);
router2.get(
  "/me",
  auth(
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.HUB_MANAGER,
    UserRole.OPERATIONS_MANAGER,
    UserRole.COURIER
  ),
  // validateRequest
  AuthController.getMe
);
router2.post("/refresh-token", AuthController.refreshToken);
router2.post("/google", AuthController.googleLogin);
router2.post(
  "/forgot-password",
  validateRequest(UserValidation.ForgotPasswordZodSchema),
  AuthController.forgotPassword
);
router2.post(
  "/reset-password",
  validateRequest(UserValidation.ResetPasswordZodSchema),
  AuthController.resetPassword
);
var AuthRoutes = router2;

// src/app/module/courier/courier.router.ts
import { Router as Router3 } from "express";

// src/app/module/courier/courier.controller.ts
import httpStatus9 from "http-status";

// src/app/module/courier/courier.service.ts
import httpStatus8 from "http-status";
var getCourierByUserId = async (userId) => {
  const courier = await prisma.courier.findUnique({
    where: { userId },
    include: {
      hub: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      }
    }
  });
  if (!courier) {
    throw new AppError(
      httpStatus8.NOT_FOUND,
      "Courier profile not found for this user account."
    );
  }
  return courier;
};
var getMyTasks = async (userId, query) => {
  const courier = await getCourierByUserId(userId);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const whereConditions = {
    courierId: courier.id
  };
  if (query.status) {
    whereConditions.status = query.status;
  }
  const shipmentWhere = {};
  if (query.shipmentStatus) {
    shipmentWhere.status = query.shipmentStatus;
  }
  if (query.searchTerm) {
    shipmentWhere.OR = [
      {
        trackingNumber: {
          contains: query.searchTerm,
          mode: "insensitive"
        }
      },
      {
        description: {
          contains: query.searchTerm,
          mode: "insensitive"
        }
      }
    ];
  }
  if (Object.keys(shipmentWhere).length > 0) {
    whereConditions.shipment = {
      is: shipmentWhere
    };
  }
  const sortBy = query.sortBy || "assignedAt";
  const sortOrder = query.sortOrder || "desc";
  const [tasks, total] = await Promise.all([
    prisma.courierParcel.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      },
      include: {
        shipment: {
          include: {
            pickupAddress: true,
            deliveryAddress: true,
            originHub: true,
            destinationHub: true,
            customer: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    phone: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      }
    }),
    prisma.courierParcel.count({
      where: whereConditions
    })
  ]);
  return {
    data: tasks,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getTaskById = async (userId, assignmentId) => {
  const courier = await getCourierByUserId(userId);
  const task = await prisma.courierParcel.findUnique({
    where: { id: assignmentId },
    include: {
      shipment: {
        include: {
          pickupAddress: true,
          deliveryAddress: true,
          originHub: true,
          destinationHub: true,
          statusHistory: {
            orderBy: {
              createdAt: "asc"
            }
          },
          deliveryAttempts: {
            include: {
              proofOfDelivery: true
            },
            orderBy: {
              attemptedAt: "asc"
            }
          },
          payment: true,
          customer: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                  email: true
                }
              }
            }
          }
        }
      }
    }
  });
  if (!task) {
    throw new AppError(httpStatus8.NOT_FOUND, "Assignment task not found.");
  }
  if (task.courierId !== courier.id) {
    throw new AppError(
      httpStatus8.FORBIDDEN,
      "You are not authorized to view this assignment."
    );
  }
  return task;
};
var acceptAssignment = async (userId, assignmentId) => {
  const courier = await getCourierByUserId(userId);
  const assignment = await prisma.courierParcel.findUnique({
    where: { id: assignmentId },
    include: { shipment: true }
  });
  if (!assignment) {
    throw new AppError(httpStatus8.NOT_FOUND, "Assignment task not found.");
  }
  if (assignment.courierId !== courier.id) {
    throw new AppError(
      httpStatus8.FORBIDDEN,
      "You cannot accept an assignment that is not assigned to you."
    );
  }
  if (assignment.status !== AssignmentStatus.PENDING) {
    throw new AppError(
      httpStatus8.BAD_REQUEST,
      `Assignment is currently in '${assignment.status}' state and cannot be accepted.`
    );
  }
  const updatedAssignment = await prisma.$transaction(async (tx) => {
    const updated = await tx.courierParcel.update({
      where: { id: assignmentId },
      data: {
        status: AssignmentStatus.ACCEPTED,
        acceptedAt: /* @__PURE__ */ new Date()
      },
      include: {
        shipment: true
      }
    });
    if (assignment.shipment.status === ShipmentStatus.COURIER_ASSIGNED) {
      await tx.shipment.update({
        where: { id: assignment.shipmentId },
        data: {
          status: ShipmentStatus.PICKUP_ASSIGNED
        }
      });
    }
    await tx.shipmentStatusHistory.create({
      data: {
        shipmentId: assignment.shipmentId,
        status: assignment.shipment.status === ShipmentStatus.COURIER_ASSIGNED ? ShipmentStatus.PICKUP_ASSIGNED : assignment.shipment.status,
        location: courier.hub?.name || "Assigned Hub",
        note: `Courier rider ${courier.user.name} accepted the task assignment.`,
        updatedBy: userId
      }
    });
    return updated;
  });
  return updatedAssignment;
};
var rejectAssignment = async (userId, assignmentId, payload) => {
  const courier = await getCourierByUserId(userId);
  const assignment = await prisma.courierParcel.findUnique({
    where: { id: assignmentId },
    include: { shipment: true }
  });
  if (!assignment) {
    throw new AppError(httpStatus8.NOT_FOUND, "Assignment task not found.");
  }
  if (assignment.courierId !== courier.id) {
    throw new AppError(
      httpStatus8.FORBIDDEN,
      "You cannot reject an assignment that is not assigned to you."
    );
  }
  if (assignment.status !== AssignmentStatus.PENDING) {
    throw new AppError(
      httpStatus8.BAD_REQUEST,
      `Assignment is currently in '${assignment.status}' state and cannot be rejected.`
    );
  }
  const updatedAssignment = await prisma.$transaction(async (tx) => {
    const updated = await tx.courierParcel.update({
      where: { id: assignmentId },
      data: {
        status: AssignmentStatus.REJECTED
      }
    });
    await tx.shipment.update({
      where: { id: assignment.shipmentId },
      data: {
        status: ShipmentStatus.PENDING_APPROVAL
      }
    });
    await tx.shipmentStatusHistory.create({
      data: {
        shipmentId: assignment.shipmentId,
        status: ShipmentStatus.PENDING_APPROVAL,
        location: courier.hub?.name || "Hub Area",
        note: `Courier rider ${courier.user.name} rejected assignment: ${payload.reason || "No reason provided"}. Returned to pending approval.`,
        updatedBy: userId
      }
    });
    return updated;
  });
  return updatedAssignment;
};
var pickupShipment = async (userId, shipmentId, payload) => {
  const courier = await getCourierByUserId(userId);
  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId },
    include: { pickupAddress: true }
  });
  if (!shipment) {
    throw new AppError(httpStatus8.NOT_FOUND, "Shipment not found.");
  }
  if (shipment.status !== ShipmentStatus.COURIER_ASSIGNED && shipment.status !== ShipmentStatus.PICKUP_ASSIGNED) {
    throw new AppError(
      httpStatus8.BAD_REQUEST,
      `Shipment cannot be marked as picked up while in '${shipment.status}' status.`
    );
  }
  const updatedShipment = await prisma.$transaction(async (tx) => {
    const updated = await tx.shipment.update({
      where: { id: shipmentId },
      data: {
        status: ShipmentStatus.PICKED_UP
      },
      include: {
        pickupAddress: true,
        deliveryAddress: true,
        originHub: true,
        destinationHub: true
      }
    });
    await tx.shipmentStatusHistory.create({
      data: {
        shipmentId,
        status: ShipmentStatus.PICKED_UP,
        location: shipment.pickupAddress?.area || "Pickup Location",
        note: payload.note || `Parcel picked up by courier rider ${courier.user.name}`,
        updatedBy: userId
      }
    });
    return updated;
  });
  return updatedShipment;
};
var deliverToOriginHub = async (userId, shipmentId, payload) => {
  const courier = await getCourierByUserId(userId);
  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId },
    include: { originHub: true }
  });
  if (!shipment) {
    throw new AppError(httpStatus8.NOT_FOUND, "Shipment not found.");
  }
  if (shipment.status !== ShipmentStatus.PICKED_UP) {
    throw new AppError(
      httpStatus8.BAD_REQUEST,
      `Shipment must be in 'PICKED_UP' status before arriving at Origin Hub (current: '${shipment.status}').`
    );
  }
  const updatedShipment = await prisma.$transaction(async (tx) => {
    const updated = await tx.shipment.update({
      where: { id: shipmentId },
      data: {
        status: ShipmentStatus.AT_ORIGIN_HUB
      },
      include: {
        pickupAddress: true,
        deliveryAddress: true,
        originHub: true,
        destinationHub: true
      }
    });
    await tx.courierParcel.updateMany({
      where: {
        shipmentId,
        courierId: courier.id,
        status: { in: [AssignmentStatus.PENDING, AssignmentStatus.ACCEPTED] }
      },
      data: {
        status: AssignmentStatus.COMPLETED,
        completedAt: /* @__PURE__ */ new Date()
      }
    });
    await tx.shipmentStatusHistory.create({
      data: {
        shipmentId,
        status: ShipmentStatus.AT_ORIGIN_HUB,
        location: shipment.originHub?.name || "Origin Hub",
        note: payload.note || `Parcel dropped off and checked in at Origin Hub by ${courier.user.name}`,
        updatedBy: userId
      }
    });
    return updated;
  });
  return updatedShipment;
};
var startDelivery = async (userId, shipmentId, payload) => {
  const courier = await getCourierByUserId(userId);
  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId },
    include: { destinationHub: true }
  });
  if (!shipment) {
    throw new AppError(httpStatus8.NOT_FOUND, "Shipment not found.");
  }
  const allowableStatuses = [
    ShipmentStatus.AT_DESTINATION_HUB,
    ShipmentStatus.AT_ORIGIN_HUB,
    ShipmentStatus.RESCHEDULED
  ];
  if (!allowableStatuses.includes(shipment.status)) {
    throw new AppError(
      httpStatus8.BAD_REQUEST,
      `Shipment cannot be moved to OUT_FOR_DELIVERY from status '${shipment.status}'.`
    );
  }
  const updatedShipment = await prisma.$transaction(async (tx) => {
    const updated = await tx.shipment.update({
      where: { id: shipmentId },
      data: {
        status: ShipmentStatus.OUT_FOR_DELIVERY
      },
      include: {
        pickupAddress: true,
        deliveryAddress: true,
        originHub: true,
        destinationHub: true
      }
    });
    await tx.courierParcel.updateMany({
      where: {
        shipmentId,
        courierId: courier.id,
        status: AssignmentStatus.PENDING
      },
      data: {
        status: AssignmentStatus.ACCEPTED,
        acceptedAt: /* @__PURE__ */ new Date()
      }
    });
    await tx.shipmentStatusHistory.create({
      data: {
        shipmentId,
        status: ShipmentStatus.OUT_FOR_DELIVERY,
        location: shipment.destinationHub?.name || "Delivery Zone",
        note: payload.note || `Parcel is out for delivery with courier ${courier.user.name}`,
        updatedBy: userId
      }
    });
    return updated;
  });
  return updatedShipment;
};
var completeDelivery = async (userId, shipmentId, payload) => {
  const courier = await getCourierByUserId(userId);
  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId },
    include: { deliveryAddress: true, payment: true }
  });
  if (!shipment) {
    throw new AppError(httpStatus8.NOT_FOUND, "Shipment not found.");
  }
  if (shipment.status !== ShipmentStatus.OUT_FOR_DELIVERY && shipment.status !== ShipmentStatus.RESCHEDULED) {
    throw new AppError(
      httpStatus8.BAD_REQUEST,
      `Shipment must be in 'OUT_FOR_DELIVERY' status to be marked delivered (current: '${shipment.status}').`
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const previousAttempts = await tx.deliveryAttempt.count({
      where: { shipmentId }
    });
    const attemptNumber = previousAttempts + 1;
    const deliveryAttempt = await tx.deliveryAttempt.create({
      data: {
        shipmentId,
        courierId: courier.id,
        attemptNumber,
        status: AttemptStatus.SUCCESS,
        notes: payload.notes || "Delivered successfully",
        attemptedAt: /* @__PURE__ */ new Date()
      }
    });
    const pod = await tx.proofOfDelivery.create({
      data: {
        shipmentId,
        deliveryAttemptId: deliveryAttempt.id,
        recipientName: payload.recipientName,
        recipientPhone: payload.recipientPhone,
        imageUrl: payload.imageUrl || null,
        signatureUrl: payload.signatureUrl || null,
        notes: payload.notes || null
      }
    });
    if (payload.paymentCollected || shipment.paymentStatus === PaymentStatus.PENDING) {
      if (shipment.payment) {
        await tx.payment.update({
          where: { id: shipment.payment.id },
          data: {
            status: PaymentStatus.PAID,
            paidAt: /* @__PURE__ */ new Date(),
            provider: payload.paymentMethod || shipment.payment.provider,
            transactionId: payload.transactionId || shipment.payment.transactionId
          }
        });
      } else {
        await tx.payment.create({
          data: {
            shipmentId,
            amount: shipment.deliveryCharge,
            provider: payload.paymentMethod || "CASH_ON_DELIVERY",
            status: PaymentStatus.PAID,
            paidAt: /* @__PURE__ */ new Date(),
            transactionId: payload.transactionId || null
          }
        });
      }
    }
    await tx.courierParcel.updateMany({
      where: {
        shipmentId,
        courierId: courier.id,
        status: { in: [AssignmentStatus.PENDING, AssignmentStatus.ACCEPTED] }
      },
      data: {
        status: AssignmentStatus.COMPLETED,
        completedAt: /* @__PURE__ */ new Date()
      }
    });
    const updatedShipment = await tx.shipment.update({
      where: { id: shipmentId },
      data: {
        status: ShipmentStatus.DELIVERED,
        paymentStatus: payload.paymentCollected || shipment.paymentStatus === PaymentStatus.PENDING ? PaymentStatus.PAID : shipment.paymentStatus
      },
      include: {
        pickupAddress: true,
        deliveryAddress: true,
        proofOfDelivery: true,
        payment: true
      }
    });
    await tx.shipmentStatusHistory.create({
      data: {
        shipmentId,
        status: ShipmentStatus.DELIVERED,
        location: shipment.deliveryAddress?.area || "Destination Address",
        note: `Successfully delivered to ${payload.recipientName} (${payload.recipientPhone})`,
        updatedBy: userId
      }
    });
    return {
      shipment: updatedShipment,
      proofOfDelivery: pod,
      attempt: deliveryAttempt
    };
  });
  return result;
};
var recordDeliveryFailed = async (userId, shipmentId, payload) => {
  const courier = await getCourierByUserId(userId);
  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId },
    include: { deliveryAddress: true }
  });
  if (!shipment) {
    throw new AppError(httpStatus8.NOT_FOUND, "Shipment not found.");
  }
  if (shipment.status !== ShipmentStatus.OUT_FOR_DELIVERY && shipment.status !== ShipmentStatus.RESCHEDULED) {
    throw new AppError(
      httpStatus8.BAD_REQUEST,
      `Delivery failure can only be recorded when shipment is OUT_FOR_DELIVERY (current: '${shipment.status}').`
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const previousAttempts = await tx.deliveryAttempt.count({
      where: { shipmentId }
    });
    const attemptNumber = previousAttempts + 1;
    const failedAttempt = await tx.deliveryAttempt.create({
      data: {
        shipmentId,
        courierId: courier.id,
        attemptNumber,
        status: AttemptStatus.FAILED,
        failureReason: payload.failureReason,
        notes: payload.notes || null,
        attemptedAt: /* @__PURE__ */ new Date()
      }
    });
    const updatedShipment = await tx.shipment.update({
      where: { id: shipmentId },
      data: {
        status: ShipmentStatus.DELIVERY_FAILED
      },
      include: {
        deliveryAddress: true
      }
    });
    await tx.shipmentStatusHistory.create({
      data: {
        shipmentId,
        status: ShipmentStatus.DELIVERY_FAILED,
        location: shipment.deliveryAddress?.area || "Delivery Zone",
        note: `Delivery attempt #${attemptNumber} failed: ${payload.failureReason}`,
        updatedBy: userId
      }
    });
    return {
      shipment: updatedShipment,
      attempt: failedAttempt
    };
  });
  return result;
};
var rescheduleDelivery = async (userId, shipmentId, payload) => {
  const courier = await getCourierByUserId(userId);
  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId }
  });
  if (!shipment) {
    throw new AppError(httpStatus8.NOT_FOUND, "Shipment not found.");
  }
  if (shipment.status !== ShipmentStatus.DELIVERY_FAILED && shipment.status !== ShipmentStatus.OUT_FOR_DELIVERY) {
    throw new AppError(
      httpStatus8.BAD_REQUEST,
      `Shipment cannot be rescheduled from status '${shipment.status}'.`
    );
  }
  const scheduledDate = new Date(payload.scheduledAt);
  const updatedShipment = await prisma.$transaction(async (tx) => {
    const updated = await tx.shipment.update({
      where: { id: shipmentId },
      data: {
        status: ShipmentStatus.RESCHEDULED,
        scheduledPickupAt: scheduledDate
      }
    });
    await tx.shipmentStatusHistory.create({
      data: {
        shipmentId,
        status: ShipmentStatus.RESCHEDULED,
        note: `Delivery rescheduled for ${scheduledDate.toISOString()}. Reason: ${payload.reason || "Customer requested alternative delivery time"} (Handled by ${courier.user.name})`,
        updatedBy: userId
      }
    });
    return updated;
  });
  return updatedShipment;
};
var returnShipment = async (userId, shipmentId, payload) => {
  const courier = await getCourierByUserId(userId);
  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId },
    include: { pickupAddress: true }
  });
  if (!shipment) {
    throw new AppError(httpStatus8.NOT_FOUND, "Shipment not found.");
  }
  if (shipment.status !== ShipmentStatus.RETURN_IN_TRANSIT && shipment.status !== ShipmentStatus.RETURN_INITIATED) {
    throw new AppError(
      httpStatus8.BAD_REQUEST,
      `Shipment must be in 'RETURN_IN_TRANSIT' or 'RETURN_INITIATED' to be marked as RETURNED (current: '${shipment.status}').`
    );
  }
  const updatedShipment = await prisma.$transaction(async (tx) => {
    const updated = await tx.shipment.update({
      where: { id: shipmentId },
      data: {
        status: ShipmentStatus.RETURNED
      },
      include: {
        pickupAddress: true,
        deliveryAddress: true
      }
    });
    await tx.courierParcel.updateMany({
      where: {
        shipmentId,
        courierId: courier.id,
        status: { in: [AssignmentStatus.PENDING, AssignmentStatus.ACCEPTED] }
      },
      data: {
        status: AssignmentStatus.COMPLETED,
        completedAt: /* @__PURE__ */ new Date()
      }
    });
    await tx.shipmentStatusHistory.create({
      data: {
        shipmentId,
        status: ShipmentStatus.RETURNED,
        location: shipment.pickupAddress?.area || "Original Sender Address",
        note: `Parcel returned to sender (${payload.recipientName || "Sender"}). Notes: ${payload.notes || "Returned successfully"} (Delivered back by ${courier.user.name})`,
        updatedBy: userId
      }
    });
    return updated;
  });
  return updatedShipment;
};
var CourierService = {
  getMyTasks,
  getTaskById,
  acceptAssignment,
  rejectAssignment,
  pickupShipment,
  deliverToOriginHub,
  startDelivery,
  completeDelivery,
  recordDeliveryFailed,
  rescheduleDelivery,
  returnShipment
};

// src/app/module/courier/courier.controller.ts
var getMyTasks2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus9.UNAUTHORIZED,
      "User context missing from request."
    );
  }
  const result = await CourierService.getMyTasks(user.userId, req.query);
  sendResponse(res, {
    statusCode: httpStatus9.OK,
    success: true,
    message: "Courier tasks retrieved successfully.",
    data: result.data,
    meta: result.meta
  });
});
var getTaskById2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus9.UNAUTHORIZED,
      "User context missing from request."
    );
  }
  const { id } = req.params;
  const result = await CourierService.getTaskById(user.userId, id);
  sendResponse(res, {
    statusCode: httpStatus9.OK,
    success: true,
    message: "Task assignment details retrieved successfully.",
    data: result
  });
});
var acceptAssignment2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus9.UNAUTHORIZED,
      "User context missing from request."
    );
  }
  const { id } = req.params;
  const result = await CourierService.acceptAssignment(
    user.userId,
    id
  );
  sendResponse(res, {
    statusCode: httpStatus9.OK,
    success: true,
    message: "Task assignment accepted successfully.",
    data: result
  });
});
var rejectAssignment2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus9.UNAUTHORIZED,
      "User context missing from request."
    );
  }
  const { id } = req.params;
  const result = await CourierService.rejectAssignment(
    user.userId,
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus9.OK,
    success: true,
    message: "Task assignment rejected successfully.",
    data: result
  });
});
var pickupShipment2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus9.UNAUTHORIZED,
      "User context missing from request."
    );
  }
  const { id } = req.params;
  const result = await CourierService.pickupShipment(
    user.userId,
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus9.OK,
    success: true,
    message: "Parcel successfully picked up from sender.",
    data: result
  });
});
var deliverToOriginHub2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus9.UNAUTHORIZED,
      "User context missing from request."
    );
  }
  const { id } = req.params;
  const result = await CourierService.deliverToOriginHub(
    user.userId,
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus9.OK,
    success: true,
    message: "Parcel delivered and checked into Origin Hub successfully.",
    data: result
  });
});
var startDelivery2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus9.UNAUTHORIZED,
      "User context missing from request."
    );
  }
  const { id } = req.params;
  const result = await CourierService.startDelivery(
    user.userId,
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus9.OK,
    success: true,
    message: "Parcel is now Out for Delivery.",
    data: result
  });
});
var completeDelivery2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus9.UNAUTHORIZED,
      "User context missing from request."
    );
  }
  const { id } = req.params;
  const result = await CourierService.completeDelivery(
    user.userId,
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus9.OK,
    success: true,
    message: "Parcel delivered successfully with proof of delivery.",
    data: result
  });
});
var recordDeliveryFailed2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus9.UNAUTHORIZED,
      "User context missing from request."
    );
  }
  const { id } = req.params;
  const result = await CourierService.recordDeliveryFailed(
    user.userId,
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus9.OK,
    success: true,
    message: "Delivery attempt failure recorded.",
    data: result
  });
});
var rescheduleDelivery2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus9.UNAUTHORIZED,
      "User context missing from request."
    );
  }
  const { id } = req.params;
  const result = await CourierService.rescheduleDelivery(
    user.userId,
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus9.OK,
    success: true,
    message: "Delivery attempt rescheduled successfully.",
    data: result
  });
});
var returnShipment2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus9.UNAUTHORIZED,
      "User context missing from request."
    );
  }
  const { id } = req.params;
  const result = await CourierService.returnShipment(
    user.userId,
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus9.OK,
    success: true,
    message: "Parcel return completed successfully.",
    data: result
  });
});
var CourierController = {
  getMyTasks: getMyTasks2,
  getTaskById: getTaskById2,
  acceptAssignment: acceptAssignment2,
  rejectAssignment: rejectAssignment2,
  pickupShipment: pickupShipment2,
  deliverToOriginHub: deliverToOriginHub2,
  startDelivery: startDelivery2,
  completeDelivery: completeDelivery2,
  recordDeliveryFailed: recordDeliveryFailed2,
  rescheduleDelivery: rescheduleDelivery2,
  returnShipment: returnShipment2
};

// src/app/module/courier/courier.validation.ts
import { z as z3 } from "zod";
var PickupShipmentZodSchema = z3.object({
  note: z3.string().max(255).optional()
});
var DeliverToHubZodSchema = z3.object({
  note: z3.string().max(255).optional()
});
var StartDeliveryZodSchema = z3.object({
  note: z3.string().max(255).optional()
});
var CompleteDeliveryZodSchema = z3.object({
  recipientName: z3.string().min(2, "Recipient name must be at least 2 characters long").max(255),
  recipientPhone: z3.string().min(6, "Recipient phone must be at least 6 characters long").max(50),
  imageUrl: z3.string().url("Invalid image URL").optional().or(z3.literal("")),
  signatureUrl: z3.string().url("Invalid signature URL").optional().or(z3.literal("")),
  notes: z3.string().max(500).optional(),
  paymentCollected: z3.boolean().optional(),
  paymentMethod: z3.string().max(50).optional(),
  transactionId: z3.string().max(255).optional()
});
var DeliveryFailedZodSchema = z3.object({
  failureReason: z3.string().min(3, "Failure reason must be at least 3 characters long").max(255),
  notes: z3.string().max(500).optional()
});
var RescheduleZodSchema = z3.object({
  scheduledAt: z3.string().min(1, "Scheduled date/time is required"),
  reason: z3.string().max(255).optional()
});
var ReturnedZodSchema = z3.object({
  recipientName: z3.string().max(255).optional(),
  notes: z3.string().max(500).optional()
});
var RejectAssignmentZodSchema = z3.object({
  reason: z3.string().max(255).optional()
});
var CourierValidation = {
  PickupShipmentZodSchema,
  DeliverToHubZodSchema,
  StartDeliveryZodSchema,
  CompleteDeliveryZodSchema,
  DeliveryFailedZodSchema,
  RescheduleZodSchema,
  ReturnedZodSchema,
  RejectAssignmentZodSchema
};

// src/app/module/courier/courier.router.ts
var router3 = Router3();
router3.get(
  "/tasks",
  auth(UserRole.COURIER, UserRole.ADMIN, UserRole.OPERATIONS_MANAGER),
  CourierController.getMyTasks
);
router3.get(
  "/tasks/:id",
  auth(UserRole.COURIER, UserRole.ADMIN, UserRole.OPERATIONS_MANAGER),
  CourierController.getTaskById
);
router3.patch(
  "/assignments/:id/accept",
  auth(UserRole.COURIER),
  CourierController.acceptAssignment
);
router3.patch(
  "/assignments/:id/reject",
  auth(UserRole.COURIER),
  validateRequest(CourierValidation.RejectAssignmentZodSchema),
  CourierController.rejectAssignment
);
router3.patch(
  "/shipments/:id/pickup",
  auth(UserRole.COURIER),
  validateRequest(CourierValidation.PickupShipmentZodSchema),
  CourierController.pickupShipment
);
router3.patch(
  "/shipments/:id/deliver-to-hub",
  auth(UserRole.COURIER),
  validateRequest(CourierValidation.DeliverToHubZodSchema),
  CourierController.deliverToOriginHub
);
router3.patch(
  "/shipments/:id/out-for-delivery",
  auth(UserRole.COURIER),
  validateRequest(CourierValidation.StartDeliveryZodSchema),
  CourierController.startDelivery
);
router3.patch(
  "/shipments/:id/deliver",
  auth(UserRole.COURIER),
  validateRequest(CourierValidation.CompleteDeliveryZodSchema),
  CourierController.completeDelivery
);
router3.patch(
  "/shipments/:id/delivery-failed",
  auth(UserRole.COURIER),
  validateRequest(CourierValidation.DeliveryFailedZodSchema),
  CourierController.recordDeliveryFailed
);
router3.patch(
  "/shipments/:id/reschedule",
  auth(UserRole.COURIER, UserRole.OPERATIONS_MANAGER),
  validateRequest(CourierValidation.RescheduleZodSchema),
  CourierController.rescheduleDelivery
);
router3.patch(
  "/shipments/:id/return",
  auth(UserRole.COURIER),
  validateRequest(CourierValidation.ReturnedZodSchema),
  CourierController.returnShipment
);
var CourierRoutes = router3;

// src/app/module/operationsManager/operationsManager.router.ts
import { Router as Router4 } from "express";

// src/app/module/operationsManager/operationsManager.controller.ts
import httpStatus11 from "http-status";

// src/app/module/operationsManager/operationsManager.service.ts
import httpStatus10 from "http-status";
var getAllShipments3 = async (query) => {
  const page = Number(query.page) > 0 ? Number(query.page) : 1;
  const limit = Number(query.limit) > 0 ? Number(query.limit) : 10;
  const skip = (page - 1) * limit;
  const whereConditions = {};
  if (query.status) {
    whereConditions.status = query.status;
  }
  if (query.originHubId) {
    whereConditions.originHubId = query.originHubId;
  }
  if (query.destinationHubId) {
    whereConditions.destinationHubId = query.destinationHubId;
  }
  if (query.searchTerm) {
    whereConditions.OR = [
      { trackingNumber: { contains: query.searchTerm, mode: "insensitive" } },
      {
        customer: {
          user: {
            OR: [
              { name: { contains: query.searchTerm, mode: "insensitive" } },
              { phone: { contains: query.searchTerm, mode: "insensitive" } },
              { email: { contains: query.searchTerm, mode: "insensitive" } }
            ]
          }
        }
      }
    ];
  }
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";
  const [shipments, total] = await Promise.all([
    prisma.shipment.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      },
      include: {
        pickupAddress: true,
        deliveryAddress: true,
        originHub: true,
        destinationHub: true,
        customer: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true
              }
            }
          }
        },
        courierAssignments: {
          include: {
            courier: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    phone: true
                  }
                }
              }
            }
          }
        }
      }
    }),
    prisma.shipment.count({
      where: whereConditions
    })
  ]);
  return {
    data: shipments,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getShipmentDetails = async (shipmentId) => {
  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId },
    include: {
      pickupAddress: true,
      deliveryAddress: true,
      originHub: true,
      destinationHub: true,
      customer: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true
            }
          }
        }
      },
      courierAssignments: {
        include: {
          courier: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                  email: true
                }
              }
            }
          }
        }
      },
      statusHistory: {
        orderBy: {
          createdAt: "asc"
        }
      }
    }
  });
  if (!shipment) {
    throw new AppError(httpStatus10.NOT_FOUND, "Shipment not found.");
  }
  return shipment;
};
var assignHubAndCourier = async (managerUserId, shipmentId, payload) => {
  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId },
    include: { pickupAddress: true, deliveryAddress: true }
  });
  if (!shipment) {
    throw new AppError(httpStatus10.NOT_FOUND, "Shipment not found.");
  }
  if (shipment.status !== ShipmentStatus.PENDING_APPROVAL && shipment.status !== ShipmentStatus.CREATED) {
    throw new AppError(
      httpStatus10.BAD_REQUEST,
      `Shipment is currently in '${shipment.status}' status and cannot be assigned hubs or courier.`
    );
  }
  const originHub = await prisma.hub.findUnique({
    where: { id: payload.originHubId }
  });
  if (!originHub?.isActive) {
    throw new AppError(
      httpStatus10.BAD_REQUEST,
      "Invalid or inactive origin hub."
    );
  }
  const destinationHub = await prisma.hub.findUnique({
    where: { id: payload.destinationHubId }
  });
  if (!destinationHub?.isActive) {
    throw new AppError(
      httpStatus10.BAD_REQUEST,
      "Invalid or inactive destination hub."
    );
  }
  const courier = await prisma.courier.findUnique({
    where: { id: payload.courierId },
    include: { user: true }
  });
  if (!courier) {
    throw new AppError(httpStatus10.NOT_FOUND, "Courier rider not found.");
  }
  let deliveryCharge = payload.deliveryCharge;
  if (deliveryCharge === void 0) {
    const pricingRule = await prisma.pricingRule.findFirst({
      where: {
        zoneId: originHub.zoneId,
        deliveryType: shipment.deliveryType,
        isActive: true
      }
    });
    if (pricingRule) {
      const baseCharge = Number(pricingRule.baseCharge);
      const perKgCharge = Number(pricingRule.perKgCharge);
      const minWeight = Number(pricingRule.minWeight);
      const weight = Number(shipment.weight);
      deliveryCharge = weight > minWeight ? baseCharge + (weight - minWeight) * perKgCharge : baseCharge;
    } else {
      deliveryCharge = Number(shipment.deliveryCharge) || 60;
    }
  }
  const result = await prisma.$transaction(async (tx) => {
    await tx.courierParcel.create({
      data: {
        shipmentId,
        courierId: courier.id,
        assignedBy: managerUserId,
        status: AssignmentStatus.PENDING
      }
    });
    await tx.shipmentStatusHistory.create({
      data: {
        shipmentId,
        status: ShipmentStatus.COURIER_ASSIGNED,
        location: originHub.name,
        note: `Assigned origin hub (${originHub.name}), destination hub (${destinationHub.name}), and courier rider (${courier.user.name})`,
        updatedBy: managerUserId
      }
    });
    const updatedShipment = await tx.shipment.update({
      where: { id: shipmentId },
      data: {
        originHubId: originHub.id,
        destinationHubId: destinationHub.id,
        deliveryCharge,
        status: ShipmentStatus.COURIER_ASSIGNED
      },
      include: {
        pickupAddress: true,
        deliveryAddress: true,
        originHub: true,
        destinationHub: true,
        courierAssignments: {
          include: {
            courier: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    phone: true,
                    email: true
                  }
                }
              }
            }
          }
        },
        customer: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        }
      }
    });
    return updatedShipment;
  });
  return result;
};
var rejectShipment = async (managerUserId, shipmentId, payload) => {
  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId }
  });
  if (!shipment) {
    throw new AppError(httpStatus10.NOT_FOUND, "Shipment not found.");
  }
  if (shipment.status !== ShipmentStatus.PENDING_APPROVAL && shipment.status !== ShipmentStatus.CREATED) {
    throw new AppError(
      httpStatus10.BAD_REQUEST,
      `Shipment is currently in '${shipment.status}' status and cannot be rejected.`
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const cancelledShipment = await tx.shipment.update({
      where: { id: shipmentId },
      data: {
        status: ShipmentStatus.CANCELLED
      }
    });
    await tx.shipmentStatusHistory.create({
      data: {
        shipmentId,
        status: ShipmentStatus.CANCELLED,
        note: `Shipment rejected by Operations Manager. Reason: ${payload.reason}`,
        updatedBy: managerUserId
      }
    });
    return cancelledShipment;
  });
  return result;
};
var getCouriers3 = async (query) => {
  const page = Number(query.page) > 0 ? Number(query.page) : 1;
  const limit = Number(query.limit) > 0 ? Number(query.limit) : 20;
  const skip = (page - 1) * limit;
  const whereConditions = {};
  if (query.hubId) {
    whereConditions.hubId = query.hubId;
  }
  if (query.availabilityStatus) {
    whereConditions.availabilityStatus = query.availabilityStatus;
  }
  if (query.searchTerm) {
    whereConditions.OR = [
      { vehicleNumber: { contains: query.searchTerm, mode: "insensitive" } },
      {
        user: {
          OR: [
            { name: { contains: query.searchTerm, mode: "insensitive" } },
            { phone: { contains: query.searchTerm, mode: "insensitive" } },
            { email: { contains: query.searchTerm, mode: "insensitive" } }
          ]
        }
      }
    ];
  }
  const [couriers, total] = await Promise.all([
    prisma.courier.findMany({
      where: whereConditions,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true
          }
        },
        hub: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    }),
    prisma.courier.count({
      where: whereConditions
    })
  ]);
  return {
    data: couriers,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getHubs = async () => {
  const hubs = await prisma.hub.findMany({
    where: { isActive: true },
    include: {
      zone: true
    },
    orderBy: {
      name: "asc"
    }
  });
  return hubs;
};
var assignDeliveryCourier = async (managerUserId, shipmentId, payload) => {
  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId },
    include: {
      originHub: true,
      destinationHub: true
    }
  });
  if (!shipment) {
    throw new AppError(httpStatus10.NOT_FOUND, "Shipment not found.");
  }
  const allowableStatuses = [
    ShipmentStatus.AT_DESTINATION_HUB,
    ShipmentStatus.AT_ORIGIN_HUB,
    ShipmentStatus.RESCHEDULED
  ];
  if (!allowableStatuses.includes(shipment.status)) {
    throw new AppError(
      httpStatus10.BAD_REQUEST,
      `Shipment cannot be assigned for delivery from status '${shipment.status}'.`
    );
  }
  if (shipment.status === ShipmentStatus.AT_ORIGIN_HUB && shipment.originHubId && shipment.destinationHubId && shipment.originHubId !== shipment.destinationHubId) {
    throw new AppError(
      httpStatus10.BAD_REQUEST,
      "Shipment is at Origin Hub and must be transferred to Destination Hub before delivery dispatch."
    );
  }
  const courier = await prisma.courier.findUnique({
    where: { id: payload.courierId },
    include: { user: true }
  });
  if (!courier) {
    throw new AppError(httpStatus10.NOT_FOUND, "Courier rider not found.");
  }
  const result = await prisma.$transaction(async (tx) => {
    await tx.courierParcel.create({
      data: {
        shipmentId,
        courierId: courier.id,
        assignedBy: managerUserId,
        status: AssignmentStatus.PENDING
      }
    });
    const updatedShipment = await tx.shipment.update({
      where: { id: shipmentId },
      data: {
        status: ShipmentStatus.OUT_FOR_DELIVERY
      },
      include: {
        pickupAddress: true,
        deliveryAddress: true,
        originHub: true,
        destinationHub: true,
        courierAssignments: {
          include: {
            courier: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    phone: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      }
    });
    await tx.shipmentStatusHistory.create({
      data: {
        shipmentId,
        status: ShipmentStatus.OUT_FOR_DELIVERY,
        location: shipment.destinationHub?.name || shipment.originHub?.name || "Distribution Hub",
        note: payload.note || `Assigned delivery courier ${courier.user.name}. Parcel is out for delivery.`,
        updatedBy: managerUserId
      }
    });
    return updatedShipment;
  });
  return result;
};
var createHubTransfer = async (managerUserId, shipmentId, payload) => {
  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId },
    include: { originHub: true, destinationHub: true }
  });
  if (!shipment) {
    throw new AppError(httpStatus10.NOT_FOUND, "Shipment not found.");
  }
  if (shipment.status !== ShipmentStatus.AT_ORIGIN_HUB) {
    throw new AppError(
      httpStatus10.BAD_REQUEST,
      `Shipment must be in 'AT_ORIGIN_HUB' status to initiate inter-hub transfer (current: '${shipment.status}').`
    );
  }
  const destinationHubId = payload.toHubId || shipment.destinationHubId;
  if (!destinationHubId) {
    throw new AppError(
      httpStatus10.BAD_REQUEST,
      "Destination hub ID is required for inter-hub transfer."
    );
  }
  if (destinationHubId === shipment.originHubId) {
    throw new AppError(
      httpStatus10.BAD_REQUEST,
      "Origin Hub and Destination Hub are the same. Inter-hub transfer is not required; proceed to local delivery dispatch."
    );
  }
  const destHub = await prisma.hub.findUnique({
    where: { id: destinationHubId }
  });
  if (!destHub?.isActive) {
    throw new AppError(
      httpStatus10.BAD_REQUEST,
      "Invalid or inactive destination hub."
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const transfer = await tx.hubTransfer.create({
      data: {
        shipmentId,
        fromHubId: shipment.originHubId,
        toHubId: destinationHubId,
        status: TransferStatus.DISPATCHED,
        dispatchedAt: /* @__PURE__ */ new Date(),
        createdBy: managerUserId
      },
      include: {
        fromHub: true,
        toHub: true
      }
    });
    const updatedShipment = await tx.shipment.update({
      where: { id: shipmentId },
      data: {
        status: ShipmentStatus.IN_TRANSIT,
        destinationHubId
      }
    });
    await tx.shipmentStatusHistory.create({
      data: {
        shipmentId,
        status: ShipmentStatus.IN_TRANSIT,
        location: shipment.originHub?.name || "Origin Hub",
        note: payload.note || `Dispatched in transit from ${shipment.originHub?.name} to ${destHub.name}`,
        updatedBy: managerUserId
      }
    });
    return {
      transfer,
      shipment: updatedShipment
    };
  });
  return result;
};
var receiveHubTransfer = async (managerUserId, transferId, payload) => {
  const transfer = await prisma.hubTransfer.findUnique({
    where: { id: transferId },
    include: { toHub: true, shipment: true }
  });
  if (!transfer) {
    throw new AppError(httpStatus10.NOT_FOUND, "Hub transfer record not found.");
  }
  if (transfer.status === TransferStatus.RECEIVED || transfer.status === TransferStatus.CANCELLED) {
    throw new AppError(
      httpStatus10.BAD_REQUEST,
      `Hub transfer is already in '${transfer.status}' state.`
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const updatedTransfer = await tx.hubTransfer.update({
      where: { id: transferId },
      data: {
        status: TransferStatus.RECEIVED,
        receivedAt: /* @__PURE__ */ new Date()
      },
      include: {
        fromHub: true,
        toHub: true
      }
    });
    const updatedShipment = await tx.shipment.update({
      where: { id: transfer.shipmentId },
      data: {
        status: ShipmentStatus.AT_DESTINATION_HUB
      }
    });
    await tx.shipmentStatusHistory.create({
      data: {
        shipmentId: transfer.shipmentId,
        status: ShipmentStatus.AT_DESTINATION_HUB,
        location: transfer.toHub?.name || "Destination Hub",
        note: payload.note || `Received and checked in at destination hub (${transfer.toHub?.name})`,
        updatedBy: managerUserId
      }
    });
    return {
      transfer: updatedTransfer,
      shipment: updatedShipment
    };
  });
  return result;
};
var initiateReturn = async (managerUserId, shipmentId, payload) => {
  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId }
  });
  if (!shipment) {
    throw new AppError(httpStatus10.NOT_FOUND, "Shipment not found.");
  }
  if (shipment.status === ShipmentStatus.DELIVERED) {
    throw new AppError(
      httpStatus10.BAD_REQUEST,
      "Cannot initiate return for an already delivered shipment."
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.shipment.update({
      where: { id: shipmentId },
      data: {
        status: ShipmentStatus.RETURN_INITIATED
      }
    });
    await tx.shipmentStatusHistory.create({
      data: {
        shipmentId,
        status: ShipmentStatus.RETURN_INITIATED,
        note: `Return initiated. Reason: ${payload.reason}. ${payload.notes || ""}`.trim(),
        updatedBy: managerUserId
      }
    });
    return updated;
  });
  return result;
};
var returnInTransit = async (managerUserId, shipmentId, payload) => {
  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId },
    include: { originHub: true }
  });
  if (!shipment) {
    throw new AppError(httpStatus10.NOT_FOUND, "Shipment not found.");
  }
  if (shipment.status !== ShipmentStatus.RETURN_INITIATED) {
    throw new AppError(
      httpStatus10.BAD_REQUEST,
      `Shipment must be in 'RETURN_INITIATED' status (current: '${shipment.status}').`
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.shipment.update({
      where: { id: shipmentId },
      data: {
        status: ShipmentStatus.RETURN_IN_TRANSIT
      }
    });
    await tx.shipmentStatusHistory.create({
      data: {
        shipmentId,
        status: ShipmentStatus.RETURN_IN_TRANSIT,
        location: shipment.originHub?.name || "Return Route",
        note: payload.note || "Parcel is in transit back to sender",
        updatedBy: managerUserId
      }
    });
    return updated;
  });
  return result;
};
var cancelShipment = async (managerUserId, shipmentId, payload) => {
  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId }
  });
  if (!shipment) {
    throw new AppError(httpStatus10.NOT_FOUND, "Shipment not found.");
  }
  if (shipment.status === ShipmentStatus.DELIVERED) {
    throw new AppError(
      httpStatus10.BAD_REQUEST,
      "Cannot cancel an already delivered shipment."
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.shipment.update({
      where: { id: shipmentId },
      data: {
        status: ShipmentStatus.CANCELLED
      }
    });
    await tx.courierParcel.updateMany({
      where: {
        shipmentId,
        status: {
          in: [AssignmentStatus.PENDING, AssignmentStatus.ACCEPTED]
        }
      },
      data: {
        status: AssignmentStatus.CANCELLED
      }
    });
    await tx.shipmentStatusHistory.create({
      data: {
        shipmentId,
        status: ShipmentStatus.CANCELLED,
        note: `Shipment cancelled: ${payload.reason}`,
        updatedBy: managerUserId
      }
    });
    return updated;
  });
  return result;
};
var updateOutForDelivery = async (managerUserId, shipmentId, payload) => {
  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId },
    include: {
      originHub: true,
      destinationHub: true,
      customer: true,
      courierAssignments: {
        orderBy: { assignedAt: "desc" },
        take: 1,
        include: { courier: { include: { user: true } } }
      }
    }
  });
  if (!shipment) {
    throw new AppError(httpStatus10.NOT_FOUND, "Shipment not found.");
  }
  const allowableStatuses = [
    ShipmentStatus.IN_TRANSIT,
    ShipmentStatus.AT_DESTINATION_HUB,
    ShipmentStatus.AT_ORIGIN_HUB,
    ShipmentStatus.RESCHEDULED
  ];
  if (!allowableStatuses.includes(shipment.status)) {
    throw new AppError(
      httpStatus10.BAD_REQUEST,
      `Shipment cannot be updated to OUT_FOR_DELIVERY from status '${shipment.status}'. Expected status to be IN_TRANSIT, AT_DESTINATION_HUB, or AT_ORIGIN_HUB.`
    );
  }
  const courierId = payload.courierId;
  let assignedCourierName = shipment.courierAssignments[0]?.courier?.user?.name;
  if (courierId) {
    const courier = await prisma.courier.findUnique({
      where: { id: courierId },
      include: { user: true }
    });
    if (!courier) {
      throw new AppError(httpStatus10.NOT_FOUND, "Courier rider not found.");
    }
    assignedCourierName = courier.user.name;
  }
  const result = await prisma.$transaction(async (tx) => {
    if (courierId) {
      await tx.courierParcel.create({
        data: {
          shipmentId,
          courierId,
          assignedBy: managerUserId,
          status: AssignmentStatus.ACCEPTED,
          acceptedAt: /* @__PURE__ */ new Date()
        }
      });
    }
    const updatedShipment = await tx.shipment.update({
      where: { id: shipmentId },
      data: {
        status: ShipmentStatus.OUT_FOR_DELIVERY
      },
      include: {
        pickupAddress: true,
        deliveryAddress: true,
        originHub: true,
        destinationHub: true,
        courierAssignments: {
          orderBy: { assignedAt: "desc" },
          include: {
            courier: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    phone: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      }
    });
    await tx.shipmentStatusHistory.create({
      data: {
        shipmentId,
        status: ShipmentStatus.OUT_FOR_DELIVERY,
        location: shipment.destinationHub?.name || shipment.originHub?.name || "Distribution Hub",
        note: payload.note || (assignedCourierName ? `Parcel is out for delivery with courier rider ${assignedCourierName}.` : "Parcel is out for delivery in the recipient zone."),
        updatedBy: managerUserId
      }
    });
    await tx.notification.create({
      data: {
        userId: shipment.customer.userId,
        shipmentId,
        title: "Shipment Out For Delivery",
        message: `Your shipment ${shipment.trackingNumber} is now out for delivery!`,
        type: "OUT_FOR_DELIVERY"
      }
    });
    return updatedShipment;
  });
  return result;
};
var updateDelivered = async (managerUserId, shipmentId, payload) => {
  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId },
    include: {
      courierAssignments: {
        orderBy: { assignedAt: "desc" },
        include: {
          courier: {
            include: {
              user: true
            }
          }
        }
      },
      payment: true,
      customer: true,
      deliveryAddress: true,
      proofOfDelivery: true
    }
  });
  if (!shipment) {
    throw new AppError(httpStatus10.NOT_FOUND, "Shipment not found.");
  }
  if (shipment.status === ShipmentStatus.DELIVERED) {
    throw new AppError(
      httpStatus10.BAD_REQUEST,
      "Shipment has already been marked as DELIVERED."
    );
  }
  const hasCompletedAssignment = shipment.courierAssignments.some(
    (assignment) => assignment.status === AssignmentStatus.COMPLETED
  );
  if (!hasCompletedAssignment) {
    const latestAssignment = shipment.courierAssignments[0];
    throw new AppError(
      httpStatus10.BAD_REQUEST,
      `Cannot mark shipment as DELIVERED. The courier assignment has not been set to COMPLETED yet (current assignment status: '${latestAssignment?.status || "NO_COURIER_ASSIGNMENT"}').`
    );
  }
  const isPaymentPaid = shipment.paymentStatus === PaymentStatus.PAID || shipment.payment?.status === PaymentStatus.PAID;
  if (!isPaymentPaid) {
    throw new AppError(
      httpStatus10.BAD_REQUEST,
      `Cannot mark shipment as DELIVERED. The shipment payment must be 'PAID' (current payment status: '${shipment.paymentStatus}').`
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const updatedShipment = await tx.shipment.update({
      where: { id: shipmentId },
      data: {
        status: ShipmentStatus.DELIVERED,
        paymentStatus: PaymentStatus.PAID
      },
      include: {
        pickupAddress: true,
        deliveryAddress: true,
        originHub: true,
        destinationHub: true,
        proofOfDelivery: true,
        payment: true,
        courierAssignments: {
          include: {
            courier: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    phone: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      }
    });
    await tx.shipmentStatusHistory.create({
      data: {
        shipmentId,
        status: ShipmentStatus.DELIVERED,
        location: shipment.deliveryAddress?.area || "Destination Address",
        note: payload.note || "Shipment confirmed and marked DELIVERED by Operations Manager after verifying courier completion and payment confirmation.",
        updatedBy: managerUserId
      }
    });
    await tx.notification.create({
      data: {
        userId: shipment.customer.userId,
        shipmentId,
        title: "Shipment Delivered",
        message: `Your shipment ${shipment.trackingNumber} has been successfully delivered and confirmed by Operations.`,
        type: "SHIPMENT_DELIVERED"
      }
    });
    return updatedShipment;
  });
  return result;
};
var OperationsManagerService = {
  getAllShipments: getAllShipments3,
  getShipmentDetails,
  assignHubAndCourier,
  rejectShipment,
  getCouriers: getCouriers3,
  getHubs,
  assignDeliveryCourier,
  createHubTransfer,
  receiveHubTransfer,
  initiateReturn,
  returnInTransit,
  cancelShipment,
  updateOutForDelivery,
  updateDelivered
};

// src/app/module/operationsManager/operationsManager.controller.ts
var getAllShipments4 = catchAsync(async (req, res) => {
  const result = await OperationsManagerService.getAllShipments(req.query);
  sendResponse(res, {
    statusCode: httpStatus11.OK,
    success: true,
    message: "Shipments retrieved successfully for operational review.",
    data: result.data,
    meta: result.meta
  });
});
var getShipmentDetails2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OperationsManagerService.getShipmentDetails(
    id
  );
  sendResponse(res, {
    statusCode: httpStatus11.OK,
    success: true,
    message: "Shipment operational details retrieved successfully.",
    data: result
  });
});
var assignHubAndCourier2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus11.UNAUTHORIZED,
      "User context missing from request."
    );
  }
  const { id } = req.params;
  const result = await OperationsManagerService.assignHubAndCourier(
    user.userId,
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus11.OK,
    success: true,
    message: "Origin Hub, Destination Hub, and Courier assigned successfully.",
    data: result
  });
});
var rejectShipment2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus11.UNAUTHORIZED,
      "User context missing from request."
    );
  }
  const { id } = req.params;
  const result = await OperationsManagerService.rejectShipment(
    user.userId,
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus11.OK,
    success: true,
    message: "Shipment rejected successfully.",
    data: result
  });
});
var getCouriers4 = catchAsync(async (req, res) => {
  const result = await OperationsManagerService.getCouriers(req.query);
  sendResponse(res, {
    statusCode: httpStatus11.OK,
    success: true,
    message: "Couriers retrieved successfully.",
    data: result.data,
    meta: result.meta
  });
});
var getHubs2 = catchAsync(async (_req, res) => {
  const result = await OperationsManagerService.getHubs();
  sendResponse(res, {
    statusCode: httpStatus11.OK,
    success: true,
    message: "Distribution hubs retrieved successfully.",
    data: result
  });
});
var assignDeliveryCourier2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      throw new AppError(
        httpStatus11.UNAUTHORIZED,
        "User context missing from request."
      );
    }
    const { id } = req.params;
    const result = await OperationsManagerService.assignDeliveryCourier(
      user.userId,
      id,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus11.OK,
      success: true,
      message: "Delivery courier assigned and parcel is Out for Delivery.",
      data: result
    });
  }
);
var createHubTransfer2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus11.UNAUTHORIZED,
      "User context missing from request."
    );
  }
  const { id } = req.params;
  const result = await OperationsManagerService.createHubTransfer(
    user.userId,
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus11.OK,
    success: true,
    message: "Inter-hub transfer initiated successfully. Parcel is In Transit.",
    data: result
  });
});
var receiveHubTransfer2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus11.UNAUTHORIZED,
      "User context missing from request."
    );
  }
  const { id } = req.params;
  const result = await OperationsManagerService.receiveHubTransfer(
    user.userId,
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus11.OK,
    success: true,
    message: "Hub transfer received successfully. Parcel is At Destination Hub.",
    data: result
  });
});
var initiateReturn2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus11.UNAUTHORIZED,
      "User context missing from request."
    );
  }
  const { id } = req.params;
  const result = await OperationsManagerService.initiateReturn(
    user.userId,
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus11.OK,
    success: true,
    message: "Return process initiated successfully.",
    data: result
  });
});
var returnInTransit2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus11.UNAUTHORIZED,
      "User context missing from request."
    );
  }
  const { id } = req.params;
  const result = await OperationsManagerService.returnInTransit(
    user.userId,
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus11.OK,
    success: true,
    message: "Return in transit updated successfully.",
    data: result
  });
});
var cancelShipment2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus11.UNAUTHORIZED,
      "User context missing from request."
    );
  }
  const { id } = req.params;
  const result = await OperationsManagerService.cancelShipment(
    user.userId,
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus11.OK,
    success: true,
    message: "Shipment cancelled successfully.",
    data: result
  });
});
var updateOutForDelivery2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus11.UNAUTHORIZED,
      "User context missing from request."
    );
  }
  const { id } = req.params;
  const result = await OperationsManagerService.updateOutForDelivery(
    user.userId,
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus11.OK,
    success: true,
    message: "Shipment status updated to OUT_FOR_DELIVERY successfully.",
    data: result
  });
});
var updateDelivered2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus11.UNAUTHORIZED,
      "User context missing from request."
    );
  }
  const { id } = req.params;
  const result = await OperationsManagerService.updateDelivered(
    user.userId,
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus11.OK,
    success: true,
    message: "Shipment verified and status updated to DELIVERED successfully.",
    data: result
  });
});
var OperationsManagerController = {
  getAllShipments: getAllShipments4,
  getShipmentDetails: getShipmentDetails2,
  assignHubAndCourier: assignHubAndCourier2,
  rejectShipment: rejectShipment2,
  getCouriers: getCouriers4,
  getHubs: getHubs2,
  assignDeliveryCourier: assignDeliveryCourier2,
  createHubTransfer: createHubTransfer2,
  receiveHubTransfer: receiveHubTransfer2,
  initiateReturn: initiateReturn2,
  returnInTransit: returnInTransit2,
  cancelShipment: cancelShipment2,
  updateOutForDelivery: updateOutForDelivery2,
  updateDelivered: updateDelivered2
};

// src/app/module/operationsManager/operationsManager.validation.ts
import { z as z4 } from "zod";
var AssignHubAndCourierZodSchema = z4.object({
  originHubId: z4.string().uuid("Invalid origin hub ID"),
  destinationHubId: z4.string().uuid("Invalid destination hub ID"),
  courierId: z4.string().uuid("Invalid courier ID"),
  deliveryCharge: z4.number().positive("Delivery charge must be positive").optional()
});
var RejectShipmentZodSchema = z4.object({
  reason: z4.string().min(3, "Rejection reason must be at least 3 characters long").max(500, "Rejection reason cannot exceed 500 characters")
});
var AssignDeliveryCourierZodSchema = z4.object({
  courierId: z4.string().uuid("Invalid courier ID"),
  note: z4.string().max(255).optional()
});
var CreateHubTransferZodSchema = z4.object({
  toHubId: z4.string().uuid("Invalid destination hub ID").optional(),
  note: z4.string().max(255).optional()
});
var ReceiveHubTransferZodSchema = z4.object({
  note: z4.string().max(255).optional()
});
var ReturnInitiateZodSchema = z4.object({
  reason: z4.string().min(3, "Return reason must be at least 3 characters long").max(500),
  notes: z4.string().max(500).optional()
});
var ReturnInTransitZodSchema = z4.object({
  note: z4.string().max(255).optional()
});
var CancelShipmentZodSchema = z4.object({
  reason: z4.string().min(3, "Cancellation reason must be at least 3 characters long").max(500)
});
var UpdateOutForDeliveryZodSchema = z4.object({
  courierId: z4.string().uuid("Invalid courier ID").optional(),
  note: z4.string().max(255).optional()
});
var UpdateDeliveredZodSchema = z4.object({
  note: z4.string().max(255).optional()
});
var OperationsManagerValidation = {
  AssignHubAndCourierZodSchema,
  RejectShipmentZodSchema,
  AssignDeliveryCourierZodSchema,
  CreateHubTransferZodSchema,
  ReceiveHubTransferZodSchema,
  ReturnInitiateZodSchema,
  ReturnInTransitZodSchema,
  CancelShipmentZodSchema,
  UpdateOutForDeliveryZodSchema,
  UpdateDeliveredZodSchema
};

// src/app/module/operationsManager/operationsManager.router.ts
var router4 = Router4();
router4.use(
  auth(UserRole.OPERATIONS_MANAGER, UserRole.ADMIN, UserRole.HUB_MANAGER)
);
router4.get("/shipments", OperationsManagerController.getAllShipments);
router4.get("/shipments/:id", OperationsManagerController.getShipmentDetails);
router4.patch(
  "/shipments/:id/assign",
  validateRequest(OperationsManagerValidation.AssignHubAndCourierZodSchema),
  OperationsManagerController.assignHubAndCourier
);
router4.patch(
  "/shipments/:id/reject",
  validateRequest(OperationsManagerValidation.RejectShipmentZodSchema),
  OperationsManagerController.rejectShipment
);
router4.patch(
  "/shipments/:id/assign-delivery",
  validateRequest(OperationsManagerValidation.AssignDeliveryCourierZodSchema),
  OperationsManagerController.assignDeliveryCourier
);
router4.post(
  "/shipments/:id/assign-delivery",
  validateRequest(OperationsManagerValidation.AssignDeliveryCourierZodSchema),
  OperationsManagerController.assignDeliveryCourier
);
router4.patch(
  "/shipments/:id/out-for-delivery",
  validateRequest(OperationsManagerValidation.UpdateOutForDeliveryZodSchema),
  OperationsManagerController.updateOutForDelivery
);
router4.patch(
  "/shipments/:id/delivered",
  validateRequest(OperationsManagerValidation.UpdateDeliveredZodSchema),
  OperationsManagerController.updateDelivered
);
router4.patch(
  "/shipments/:id/mark-delivered",
  validateRequest(OperationsManagerValidation.UpdateDeliveredZodSchema),
  OperationsManagerController.updateDelivered
);
router4.post(
  "/shipments/:id/transfer",
  validateRequest(OperationsManagerValidation.CreateHubTransferZodSchema),
  OperationsManagerController.createHubTransfer
);
router4.patch(
  "/transfers/:id/receive",
  validateRequest(OperationsManagerValidation.ReceiveHubTransferZodSchema),
  OperationsManagerController.receiveHubTransfer
);
router4.patch(
  "/shipments/:id/return-initiate",
  validateRequest(OperationsManagerValidation.ReturnInitiateZodSchema),
  OperationsManagerController.initiateReturn
);
router4.patch(
  "/shipments/:id/return-in-transit",
  validateRequest(OperationsManagerValidation.ReturnInTransitZodSchema),
  OperationsManagerController.returnInTransit
);
router4.patch(
  "/shipments/:id/cancel",
  validateRequest(OperationsManagerValidation.CancelShipmentZodSchema),
  OperationsManagerController.cancelShipment
);
router4.get("/couriers", OperationsManagerController.getCouriers);
router4.get("/hubs", OperationsManagerController.getHubs);
var OperationsManagerRoutes = router4;

// src/app/module/payment/payment.router.ts
import express, { Router as Router5 } from "express";

// src/app/module/payment/payment.controller.ts
import httpStatus13 from "http-status";

// src/app/module/payment/payment.service.ts
import httpStatus12 from "http-status";
import Stripe from "stripe";
var stripe = new Stripe(config_default.stripe_secret_key || "");
var createPaymentIntent = async (shipmentId, userId, payload) => {
  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId },
    include: {
      customer: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        }
      },
      payment: true
    }
  });
  if (!shipment) {
    throw new AppError(httpStatus12.NOT_FOUND, "Shipment not found.");
  }
  if (shipment.paymentStatus === PaymentStatus.PAID) {
    throw new AppError(
      httpStatus12.BAD_REQUEST,
      "This shipment has already been paid for."
    );
  }
  const deliveryCharge = Number(shipment.deliveryCharge) || 60;
  const currency = (payload?.currency || config_default.stripe_currency || "bdt").toLowerCase();
  const amountInSubunits = Math.round(deliveryCharge * 100);
  let paymentIntent;
  try {
    paymentIntent = await stripe.paymentIntents.create({
      amount: amountInSubunits,
      currency,
      description: `Delivery charge for ParcelPilot shipment ${shipment.trackingNumber}`,
      metadata: {
        shipmentId,
        trackingNumber: shipment.trackingNumber,
        customerName: shipment.customer.user.name,
        customerEmail: shipment.customer.user.email,
        initiatedBy: userId
      },
      automatic_payment_methods: {
        enabled: true
      }
    });
  } catch (error) {
    throw new AppError(
      httpStatus12.BAD_GATEWAY,
      `Stripe PaymentIntent creation failed: ${error.message}`
    );
  }
  await prisma.payment.upsert({
    where: { shipmentId },
    update: {
      amount: deliveryCharge,
      currency: currency.toUpperCase(),
      provider: "STRIPE",
      transactionId: paymentIntent.id,
      status: PaymentStatus.PENDING
    },
    create: {
      shipmentId,
      amount: deliveryCharge,
      currency: currency.toUpperCase(),
      provider: "STRIPE",
      transactionId: paymentIntent.id,
      status: PaymentStatus.PENDING
    }
  });
  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    amount: deliveryCharge,
    currency: currency.toUpperCase(),
    trackingNumber: shipment.trackingNumber,
    publishableKey: config_default.stripe_publishable_key
  };
};
var confirmPayment = async (shipmentId, userId, payload) => {
  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId },
    include: { payment: true }
  });
  if (!shipment) {
    throw new AppError(httpStatus12.NOT_FOUND, "Shipment not found.");
  }
  let paymentIntent;
  try {
    paymentIntent = await stripe.paymentIntents.retrieve(
      payload.paymentIntentId
    );
  } catch (error) {
    throw new AppError(
      httpStatus12.BAD_GATEWAY,
      `Failed to retrieve PaymentIntent from Stripe: ${error.message}`
    );
  }
  if (paymentIntent.status === "requires_payment_method") {
    try {
      paymentIntent = await stripe.paymentIntents.confirm(
        payload.paymentIntentId,
        {
          payment_method: payload.paymentMethodId || "pm_card_visa",
          return_url: config_default.frontend_url || "http://localhost:5000"
        }
      );
    } catch (error) {
      throw new AppError(
        httpStatus12.BAD_REQUEST,
        `Failed to process payment on Stripe: ${error.message}`
      );
    }
  }
  if (paymentIntent.status !== "succeeded") {
    throw new AppError(
      httpStatus12.BAD_REQUEST,
      `Payment has not succeeded yet on Stripe (Current status: ${paymentIntent.status}).`
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.upsert({
      where: { shipmentId },
      update: {
        status: PaymentStatus.PAID,
        paidAt: /* @__PURE__ */ new Date(),
        transactionId: paymentIntent.id,
        provider: "STRIPE"
      },
      create: {
        shipmentId,
        amount: shipment.deliveryCharge,
        currency: paymentIntent.currency.toUpperCase(),
        status: PaymentStatus.PAID,
        paidAt: /* @__PURE__ */ new Date(),
        transactionId: paymentIntent.id,
        provider: "STRIPE"
      }
    });
    const updatedShipment = await tx.shipment.update({
      where: { id: shipmentId },
      data: {
        paymentStatus: PaymentStatus.PAID
      },
      include: {
        payment: true,
        pickupAddress: true,
        deliveryAddress: true
      }
    });
    await tx.shipmentStatusHistory.create({
      data: {
        shipmentId,
        status: shipment.status,
        note: `Payment of ${shipment.deliveryCharge} ${paymentIntent.currency.toUpperCase()} completed successfully via Stripe (ID: ${paymentIntent.id}).`,
        updatedBy: userId
      }
    });
    return {
      shipment: updatedShipment,
      payment: updatedPayment
    };
  });
  return result;
};
var getPaymentStatus = async (shipmentId) => {
  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId },
    include: {
      payment: true
    }
  });
  if (!shipment) {
    throw new AppError(httpStatus12.NOT_FOUND, "Shipment not found.");
  }
  return {
    shipmentId: shipment.id,
    trackingNumber: shipment.trackingNumber,
    deliveryCharge: shipment.deliveryCharge,
    paymentStatus: shipment.paymentStatus,
    payment: shipment.payment
  };
};
var handleWebhook = async (signature, payload) => {
  if (!config_default.stripe_webhook_secret) {
    throw new AppError(
      httpStatus12.INTERNAL_SERVER_ERROR,
      "Stripe webhook secret is not configured."
    );
  }
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      config_default.stripe_webhook_secret
    );
  } catch (error) {
    throw new AppError(
      httpStatus12.BAD_REQUEST,
      `Webhook signature verification failed: ${error.message}`
    );
  }
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const shipmentId = paymentIntent.metadata?.shipmentId;
    if (shipmentId) {
      await prisma.$transaction(async (tx) => {
        await tx.payment.upsert({
          where: { shipmentId },
          update: {
            status: PaymentStatus.PAID,
            paidAt: /* @__PURE__ */ new Date(),
            transactionId: paymentIntent.id,
            provider: "STRIPE"
          },
          create: {
            shipmentId,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency.toUpperCase(),
            status: PaymentStatus.PAID,
            paidAt: /* @__PURE__ */ new Date(),
            transactionId: paymentIntent.id,
            provider: "STRIPE"
          }
        });
        await tx.shipment.update({
          where: { id: shipmentId },
          data: {
            paymentStatus: PaymentStatus.PAID
          }
        });
      });
    }
  }
  return { received: true };
};
var PaymentService = {
  createPaymentIntent,
  confirmPayment,
  getPaymentStatus,
  handleWebhook
};

// src/app/module/payment/payment.controller.ts
var createPaymentIntent2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus13.UNAUTHORIZED,
      "User context missing from request."
    );
  }
  const { shipmentId } = req.params;
  const result = await PaymentService.createPaymentIntent(
    shipmentId,
    user.userId,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus13.OK,
    success: true,
    message: "Stripe PaymentIntent generated successfully.",
    data: result
  });
});
var confirmPayment2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus13.UNAUTHORIZED,
      "User context missing from request."
    );
  }
  const { shipmentId } = req.params;
  const result = await PaymentService.confirmPayment(
    shipmentId,
    user.userId,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus13.OK,
    success: true,
    message: "Stripe payment confirmed successfully. Shipment marked as PAID.",
    data: result
  });
});
var getPaymentStatus2 = catchAsync(async (req, res) => {
  const { shipmentId } = req.params;
  const result = await PaymentService.getPaymentStatus(shipmentId);
  sendResponse(res, {
    statusCode: httpStatus13.OK,
    success: true,
    message: "Payment status retrieved successfully.",
    data: result
  });
});
var handleWebhook2 = catchAsync(async (req, res) => {
  const signature = req.headers["stripe-signature"];
  const payload = req.rawBody || req.body;
  const result = await PaymentService.handleWebhook(signature, payload);
  res.status(httpStatus13.OK).json(result);
});
var PaymentController = {
  createPaymentIntent: createPaymentIntent2,
  confirmPayment: confirmPayment2,
  getPaymentStatus: getPaymentStatus2,
  handleWebhook: handleWebhook2
};

// src/app/module/payment/payment.validation.ts
import { z as z5 } from "zod";
var CreatePaymentIntentZodSchema = z5.object({
  currency: z5.string().max(10).optional()
});
var ConfirmPaymentZodSchema = z5.object({
  paymentIntentId: z5.string().min(5, "Valid PaymentIntent ID is required"),
  paymentMethodId: z5.string().optional()
});
var PaymentValidation = {
  CreatePaymentIntentZodSchema,
  ConfirmPaymentZodSchema
};

// src/app/module/payment/payment.router.ts
var router5 = Router5();
router5.post(
  "/create-payment-intent/:shipmentId",
  auth(
    UserRole.CUSTOMER,
    UserRole.COURIER,
    UserRole.ADMIN,
    UserRole.OPERATIONS_MANAGER
  ),
  validateRequest(PaymentValidation.CreatePaymentIntentZodSchema),
  PaymentController.createPaymentIntent
);
router5.post(
  "/confirm/:shipmentId",
  auth(
    UserRole.CUSTOMER,
    UserRole.COURIER,
    UserRole.ADMIN,
    UserRole.OPERATIONS_MANAGER
  ),
  validateRequest(PaymentValidation.ConfirmPaymentZodSchema),
  PaymentController.confirmPayment
);
router5.get("/status/:shipmentId", auth(), PaymentController.getPaymentStatus);
router5.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.handleWebhook
);
var PaymentRoutes = router5;

// src/app/module/user/user.router.ts
import { Router as Router6 } from "express";

// src/app/module/user/user.controller.ts
import httpStatus15 from "http-status";

// src/app/module/user/user.service.ts
import crypto2 from "node:crypto";
import httpStatus14 from "http-status";
var getCustomerByUserId = async (userId) => {
  const customer = await prisma.customer.findUnique({
    where: {
      userId
    }
  });
  if (!customer) {
    throw new AppError(
      httpStatus14.NOT_FOUND,
      "Customer profile not found for this user account."
    );
  }
  return customer;
};
var getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    omit: {
      password: true
    },
    include: {
      customer: {
        include: {
          addresses: {
            orderBy: {
              createdAt: "desc"
            }
          }
        }
      },
      courier: {
        include: {
          hub: true
        }
      }
    }
  });
  if (!user) {
    throw new AppError(httpStatus14.NOT_FOUND, "User not found.");
  }
  return user;
};
var updateProfile = async (userId, payload) => {
  const { name, phone } = payload;
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  if (!existingUser) {
    throw new AppError(httpStatus14.NOT_FOUND, "User not found.");
  }
  if (phone && phone !== existingUser.phone) {
    const phoneConflict = await prisma.user.findFirst({
      where: {
        phone,
        NOT: {
          id: userId
        }
      }
    });
    if (phoneConflict) {
      throw new AppError(
        httpStatus14.CONFLICT,
        "Phone number is already associated with another account."
      );
    }
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      ...name ? { name } : {},
      ...phone ? { phone } : {}
    },
    omit: {
      password: true
    }
  });
  return updatedUser;
};
var getAllUsers3 = async (query) => {
  const page = Number(query.page) > 0 ? Number(query.page) : 1;
  const limit = Number(query.limit) > 0 ? Number(query.limit) : 10;
  const skip = (page - 1) * limit;
  const whereConditions = {};
  if (query.role) {
    whereConditions.role = query.role;
  }
  if (query.status) {
    whereConditions.status = query.status;
  }
  if (query.searchTerm) {
    whereConditions.OR = [
      { name: { contains: query.searchTerm, mode: "insensitive" } },
      { email: { contains: query.searchTerm, mode: "insensitive" } },
      { phone: { contains: query.searchTerm, mode: "insensitive" } }
    ];
  }
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      },
      omit: {
        password: true
      },
      include: {
        customer: true,
        courier: true
      }
    }),
    prisma.user.count({
      where: whereConditions
    })
  ]);
  return {
    data: users,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getUserById3 = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id
    },
    omit: {
      password: true
    },
    include: {
      customer: {
        include: {
          addresses: true
        }
      },
      courier: {
        include: {
          hub: true
        }
      }
    }
  });
  if (!user) {
    throw new AppError(httpStatus14.NOT_FOUND, "User not found.");
  }
  return user;
};
var updateUserStatus = async (id, payload) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id
    }
  });
  if (!existingUser) {
    throw new AppError(httpStatus14.NOT_FOUND, "User not found.");
  }
  const updatedUser = await prisma.user.update({
    where: {
      id
    },
    data: {
      ...payload.status ? { status: payload.status } : {},
      ...payload.role ? { role: payload.role } : {}
    },
    omit: {
      password: true
    }
  });
  return updatedUser;
};
var addAddress = async (userId, payload) => {
  const customer = await getCustomerByUserId(userId);
  const address = await prisma.address.create({
    data: {
      customerId: customer.id,
      label: payload.label || null,
      addressLine: payload.addressLine,
      city: payload.city,
      area: payload.area,
      postalCode: payload.postalCode || null,
      latitude: payload.latitude !== void 0 ? payload.latitude : null,
      longitude: payload.longitude !== void 0 ? payload.longitude : null
    }
  });
  return address;
};
var getMyAddresses = async (userId) => {
  const customer = await getCustomerByUserId(userId);
  const addresses = await prisma.address.findMany({
    where: {
      customerId: customer.id
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return addresses;
};
var getAddressById = async (userId, addressId, role) => {
  const address = await prisma.address.findUnique({
    where: {
      id: addressId
    }
  });
  if (!address) {
    throw new AppError(httpStatus14.NOT_FOUND, "Address not found.");
  }
  if (role !== UserRole.ADMIN && role !== UserRole.OPERATIONS_MANAGER) {
    const customer = await getCustomerByUserId(userId);
    if (address.customerId !== customer.id) {
      throw new AppError(
        httpStatus14.FORBIDDEN,
        "You do not have access to this address."
      );
    }
  }
  return address;
};
var updateAddress = async (userId, addressId, payload, role) => {
  const address = await prisma.address.findUnique({
    where: {
      id: addressId
    }
  });
  if (!address) {
    throw new AppError(httpStatus14.NOT_FOUND, "Address not found.");
  }
  if (role !== UserRole.ADMIN && role !== UserRole.OPERATIONS_MANAGER) {
    const customer = await getCustomerByUserId(userId);
    if (address.customerId !== customer.id) {
      throw new AppError(
        httpStatus14.FORBIDDEN,
        "You cannot update an address that does not belong to you."
      );
    }
  }
  const updatedAddress = await prisma.address.update({
    where: {
      id: addressId
    },
    data: {
      ...payload.label !== void 0 ? { label: payload.label } : {},
      ...payload.addressLine ? { addressLine: payload.addressLine } : {},
      ...payload.city ? { city: payload.city } : {},
      ...payload.area ? { area: payload.area } : {},
      ...payload.postalCode !== void 0 ? { postalCode: payload.postalCode } : {},
      ...payload.latitude !== void 0 ? { latitude: payload.latitude } : {},
      ...payload.longitude !== void 0 ? { longitude: payload.longitude } : {}
    }
  });
  return updatedAddress;
};
var deleteAddress = async (userId, addressId, role) => {
  const address = await prisma.address.findUnique({
    where: {
      id: addressId
    }
  });
  if (!address) {
    throw new AppError(httpStatus14.NOT_FOUND, "Address not found.");
  }
  if (role !== UserRole.ADMIN && role !== UserRole.OPERATIONS_MANAGER) {
    const customer = await getCustomerByUserId(userId);
    if (address.customerId !== customer.id) {
      throw new AppError(
        httpStatus14.FORBIDDEN,
        "You cannot delete an address that does not belong to you."
      );
    }
  }
  await prisma.address.delete({
    where: {
      id: addressId
    }
  });
  return { message: "Address deleted successfully." };
};
var createShipmentRequest = async (userId, payload) => {
  const customer = await getCustomerByUserId(userId);
  if (typeof payload.weight !== "number" || Number.isNaN(payload.weight) || !Number.isFinite(payload.weight)) {
    throw new AppError(
      httpStatus14.BAD_REQUEST,
      "Invalid parcel weight. Weight must be a valid positive number."
    );
  }
  if (payload.weight <= 0) {
    throw new AppError(
      httpStatus14.BAD_REQUEST,
      "Invalid parcel weight. Zero or negative weight is not allowed. Weight must be greater than zero."
    );
  }
  if (payload.weight < 0.05) {
    throw new AppError(
      httpStatus14.BAD_REQUEST,
      "Minimum parcel weight is 0.05 kg (50 grams)."
    );
  }
  if (payload.weight > 500) {
    throw new AppError(
      httpStatus14.BAD_REQUEST,
      "Maximum parcel weight allowed is 500 kg. For heavier cargo, please contact freight support."
    );
  }
  if (payload.recipientPhone) {
    const phoneRegex = /^(?:\+?8801[3-9]\d{8}|01[3-9]\d{8}|\+?[1-9]\d{7,14})$/;
    if (!phoneRegex.test(payload.recipientPhone.trim())) {
      throw new AppError(
        httpStatus14.BAD_REQUEST,
        "Invalid recipient phone number format. Please provide a valid phone number (e.g., +8801XXXXXXXXX or 01XXXXXXXXX)."
      );
    }
  }
  if (!payload.pickupAddress && !payload.pickupAddressId) {
    throw new AppError(
      httpStatus14.BAD_REQUEST,
      "Missing pickup address. Please provide either 'pickupAddress' details or a saved 'pickupAddressId'."
    );
  }
  if (!payload.deliveryAddress && !payload.deliveryAddressId) {
    throw new AppError(
      httpStatus14.BAD_REQUEST,
      "Missing delivery address. Please provide either 'deliveryAddress' details or a saved 'deliveryAddressId'."
    );
  }
  if (payload.pickupAddress) {
    if (!payload.pickupAddress.addressLine?.trim() || !payload.pickupAddress.city?.trim() || !payload.pickupAddress.area?.trim()) {
      throw new AppError(
        httpStatus14.BAD_REQUEST,
        "Incomplete pickup address. 'addressLine', 'city', and 'area' are required fields."
      );
    }
  }
  if (payload.deliveryAddress) {
    if (!payload.deliveryAddress.addressLine?.trim() || !payload.deliveryAddress.city?.trim() || !payload.deliveryAddress.area?.trim()) {
      throw new AppError(
        httpStatus14.BAD_REQUEST,
        "Incomplete delivery address. 'addressLine', 'city', and 'area' are required fields."
      );
    }
  }
  let pickupCity = "";
  let pickupArea = "";
  let pickupLine = "";
  if (payload.pickupAddressId) {
    const existingPickup = await prisma.address.findUnique({
      where: { id: payload.pickupAddressId }
    });
    if (!existingPickup) {
      throw new AppError(httpStatus14.NOT_FOUND, "Specified pickup address ID not found.");
    }
    if (existingPickup.customerId !== customer.id) {
      throw new AppError(
        httpStatus14.FORBIDDEN,
        "Specified pickup address does not belong to your account."
      );
    }
    pickupCity = existingPickup.city.trim();
    pickupArea = existingPickup.area.trim();
    pickupLine = existingPickup.addressLine.trim();
  } else if (payload.pickupAddress) {
    pickupCity = payload.pickupAddress.city.trim();
    pickupArea = payload.pickupAddress.area.trim();
    pickupLine = payload.pickupAddress.addressLine.trim();
  }
  let deliveryCity = "";
  let deliveryArea = "";
  let deliveryLine = "";
  if (payload.deliveryAddressId) {
    const existingDelivery = await prisma.address.findUnique({
      where: { id: payload.deliveryAddressId }
    });
    if (!existingDelivery) {
      throw new AppError(httpStatus14.NOT_FOUND, "Specified delivery address ID not found.");
    }
    deliveryCity = existingDelivery.city.trim();
    deliveryArea = existingDelivery.area.trim();
    deliveryLine = existingDelivery.addressLine.trim();
  } else if (payload.deliveryAddress) {
    deliveryCity = payload.deliveryAddress.city.trim();
    deliveryArea = payload.deliveryAddress.area.trim();
    deliveryLine = payload.deliveryAddress.addressLine.trim();
  }
  if (pickupCity.toLowerCase() === deliveryCity.toLowerCase() && pickupArea.toLowerCase() === deliveryArea.toLowerCase() && pickupLine.toLowerCase() === deliveryLine.toLowerCase()) {
    throw new AppError(
      httpStatus14.BAD_REQUEST,
      "Pickup address and delivery address cannot be identical. Parcel cannot be delivered to the exact same location."
    );
  }
  const activeZones = await prisma.zone.findMany({
    where: { isActive: true },
    include: {
      hubs: {
        where: { isActive: true },
        select: { id: true, name: true, address: true, code: true }
      }
    }
  });
  if (activeZones.length > 0) {
    const targetCity = deliveryCity.toLowerCase();
    const targetArea = deliveryArea.toLowerCase();
    const isSupported = activeZones.some((zone) => {
      const zoneNameMatch = zone.name.toLowerCase().includes(targetCity);
      const zoneCodeMatch = zone.code.toLowerCase().includes(targetCity);
      const hubMatch = zone.hubs.some(
        (hub) => hub.address.toLowerCase().includes(targetCity) || hub.address.toLowerCase().includes(targetArea) || hub.name.toLowerCase().includes(targetCity)
      );
      return zoneNameMatch || zoneCodeMatch || hubMatch;
    });
    if (!isSupported) {
      const supportedZoneNames = activeZones.map((z7) => z7.name).join(", ");
      throw new AppError(
        httpStatus14.BAD_REQUEST,
        `Unsupported delivery zone: '${deliveryCity}'. ParcelPilot currently only delivers to serviced regions: ${supportedZoneNames}.`
      );
    }
  }
  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1e3);
  const duplicateShipment = await prisma.shipment.findFirst({
    where: {
      customerId: customer.id,
      parcelType: payload.parcelType,
      weight: payload.weight,
      status: {
        in: [ShipmentStatus.PENDING_APPROVAL, ShipmentStatus.CREATED]
      },
      createdAt: {
        gte: twoMinutesAgo
      },
      deliveryAddress: {
        city: { equals: deliveryCity, mode: "insensitive" },
        addressLine: { equals: deliveryLine, mode: "insensitive" }
      }
    }
  });
  if (duplicateShipment) {
    throw new AppError(
      httpStatus14.CONFLICT,
      `Duplicate shipment submission detected. An identical shipment request was just submitted within the last 2 minutes (Tracking Number: ${duplicateShipment.trackingNumber}). Please wait before submitting again.`
    );
  }
  const datePart = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = crypto2.randomBytes(3).toString("hex").toUpperCase();
  const trackingNumber = `PP-${datePart}-${randomPart}`;
  const deliveryType = payload.deliveryType || "STANDARD";
  let deliveryCharge = 60;
  const matchingRule = await prisma.pricingRule.findFirst({
    where: {
      isActive: true,
      deliveryType,
      minWeight: { lte: payload.weight },
      maxWeight: { gte: payload.weight }
    }
  });
  if (matchingRule) {
    const base = Number(matchingRule.baseCharge);
    const perKg = Number(matchingRule.perKgCharge);
    const minW = Number(matchingRule.minWeight);
    const extra = Math.max(0, payload.weight - minW);
    deliveryCharge = Number((base + extra * perKg).toFixed(2));
  }
  let formattedDescription = payload.description?.trim() || "";
  if (payload.recipientPhone || payload.recipientName) {
    const recipientTag = `[Recipient: ${payload.recipientName?.trim() || "N/A"}, Phone: ${payload.recipientPhone?.trim() || "N/A"}]`;
    formattedDescription = formattedDescription ? `${recipientTag} ${formattedDescription}` : recipientTag;
  }
  const result = await prisma.$transaction(async (tx) => {
    let pickupAddressId;
    if (payload.pickupAddress) {
      const createdPickup = await tx.address.create({
        data: {
          customerId: customer.id,
          label: payload.pickupAddress.label || "Pickup Address",
          addressLine: payload.pickupAddress.addressLine.trim(),
          city: payload.pickupAddress.city.trim(),
          area: payload.pickupAddress.area.trim(),
          postalCode: payload.pickupAddress.postalCode || null,
          latitude: payload.pickupAddress.latitude !== void 0 ? payload.pickupAddress.latitude : null,
          longitude: payload.pickupAddress.longitude !== void 0 ? payload.pickupAddress.longitude : null
        }
      });
      pickupAddressId = createdPickup.id;
    } else if (payload.pickupAddressId) {
      pickupAddressId = payload.pickupAddressId;
    } else {
      throw new AppError(httpStatus14.BAD_REQUEST, "Pickup address is required.");
    }
    let deliveryAddressId;
    if (payload.deliveryAddress) {
      const createdDelivery = await tx.address.create({
        data: {
          customerId: customer.id,
          label: payload.deliveryAddress.label || "Delivery Address",
          addressLine: payload.deliveryAddress.addressLine.trim(),
          city: payload.deliveryAddress.city.trim(),
          area: payload.deliveryAddress.area.trim(),
          postalCode: payload.deliveryAddress.postalCode || null,
          latitude: payload.deliveryAddress.latitude !== void 0 ? payload.deliveryAddress.latitude : null,
          longitude: payload.deliveryAddress.longitude !== void 0 ? payload.deliveryAddress.longitude : null
        }
      });
      deliveryAddressId = createdDelivery.id;
    } else if (payload.deliveryAddressId) {
      deliveryAddressId = payload.deliveryAddressId;
    } else {
      throw new AppError(
        httpStatus14.BAD_REQUEST,
        "Delivery address is required."
      );
    }
    const createdShipment = await tx.shipment.create({
      data: {
        trackingNumber,
        customerId: customer.id,
        pickupAddressId,
        deliveryAddressId,
        originHubId: null,
        destinationHubId: null,
        parcelType: payload.parcelType.trim(),
        weight: payload.weight,
        description: formattedDescription || null,
        deliveryType,
        deliveryCharge,
        status: ShipmentStatus.PENDING_APPROVAL,
        paymentStatus: PaymentStatus.PENDING,
        scheduledPickupAt: payload.scheduledPickupAt ? new Date(payload.scheduledPickupAt) : null
      },
      include: {
        pickupAddress: true,
        deliveryAddress: true,
        originHub: true,
        destinationHub: true,
        customer: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        }
      }
    });
    const historyNote = "Shipment request created by customer, awaiting operational review" + (payload.recipientPhone ? ` (Recipient: ${payload.recipientName?.trim() || "N/A"}, Phone: ${payload.recipientPhone?.trim()})` : "");
    await tx.shipmentStatusHistory.create({
      data: {
        shipmentId: createdShipment.id,
        status: ShipmentStatus.PENDING_APPROVAL,
        location: null,
        note: historyNote,
        updatedBy: userId
      }
    });
    return createdShipment;
  });
  return result;
};
var getMyShipments = async (userId, query) => {
  const customer = await getCustomerByUserId(userId);
  const page = Number(query.page) > 0 ? Number(query.page) : 1;
  const limit = Number(query.limit) > 0 ? Number(query.limit) : 10;
  const skip = (page - 1) * limit;
  const whereConditions = {
    customerId: customer.id
  };
  if (query.status) {
    whereConditions.status = query.status;
  }
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";
  const [shipments, total] = await Promise.all([
    prisma.shipment.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      },
      include: {
        pickupAddress: true,
        deliveryAddress: true,
        originHub: true,
        destinationHub: true,
        statusHistory: {
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    }),
    prisma.shipment.count({
      where: whereConditions
    })
  ]);
  return {
    data: shipments,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getShipmentById = async (userId, shipmentId, role) => {
  const shipment = await prisma.shipment.findUnique({
    where: {
      id: shipmentId
    },
    include: {
      pickupAddress: true,
      deliveryAddress: true,
      originHub: true,
      destinationHub: true,
      statusHistory: {
        orderBy: {
          createdAt: "asc"
        }
      },
      customer: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        }
      }
    }
  });
  if (!shipment) {
    throw new AppError(httpStatus14.NOT_FOUND, "Shipment not found.");
  }
  if (role !== UserRole.ADMIN && role !== UserRole.OPERATIONS_MANAGER && role !== UserRole.HUB_MANAGER) {
    const customer = await getCustomerByUserId(userId);
    if (shipment.customerId !== customer.id) {
      throw new AppError(
        httpStatus14.FORBIDDEN,
        "You do not have permission to view this shipment."
      );
    }
  }
  return shipment;
};
var trackShipment = async (trackingNumber, userId) => {
  const shipment = await prisma.shipment.findUnique({
    where: { trackingNumber },
    include: {
      pickupAddress: true,
      deliveryAddress: true,
      originHub: {
        select: { id: true, name: true, code: true, address: true, phone: true }
      },
      destinationHub: {
        select: { id: true, name: true, code: true, address: true, phone: true }
      },
      statusHistory: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          status: true,
          location: true,
          note: true,
          createdAt: true
        }
      },
      courierAssignments: {
        where: {
          status: { in: [AssignmentStatus.ACCEPTED, AssignmentStatus.COMPLETED] }
        },
        orderBy: { assignedAt: "desc" },
        take: 1,
        include: {
          courier: {
            include: {
              user: {
                select: { name: true, phone: true }
              }
            }
          }
        }
      },
      deliveryAttempts: {
        orderBy: { attemptNumber: "asc" },
        select: {
          attemptNumber: true,
          status: true,
          failureReason: true,
          notes: true,
          attemptedAt: true
        }
      },
      proofOfDelivery: {
        select: {
          recipientName: true,
          imageUrl: true,
          signatureUrl: true,
          notes: true,
          createdAt: true
        }
      }
    }
  });
  if (!shipment) {
    throw new AppError(httpStatus14.NOT_FOUND, "Shipment tracking number not found.");
  }
  const activeAssignment = shipment.courierAssignments[0] || null;
  return {
    trackingNumber: shipment.trackingNumber,
    status: shipment.status,
    deliveryType: shipment.deliveryType,
    parcelType: shipment.parcelType,
    weight: Number(shipment.weight),
    scheduledPickupAt: shipment.scheduledPickupAt,
    createdAt: shipment.createdAt,
    updatedAt: shipment.updatedAt,
    pickupAddress: {
      area: shipment.pickupAddress.area,
      city: shipment.pickupAddress.city
    },
    deliveryAddress: {
      area: shipment.deliveryAddress.area,
      city: shipment.deliveryAddress.city
    },
    originHub: shipment.originHub,
    destinationHub: shipment.destinationHub,
    assignedCourier: activeAssignment?.courier?.user ? {
      name: activeAssignment.courier.user.name,
      phone: activeAssignment.courier.user.phone
    } : null,
    timeline: shipment.statusHistory,
    deliveryAttempts: shipment.deliveryAttempts,
    proofOfDelivery: shipment.proofOfDelivery
  };
};
var schedulePickup = async (userId, shipmentId, payload) => {
  const customer = await getCustomerByUserId(userId);
  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId }
  });
  if (!shipment) {
    throw new AppError(httpStatus14.NOT_FOUND, "Shipment not found.");
  }
  if (shipment.customerId !== customer.id) {
    throw new AppError(
      httpStatus14.FORBIDDEN,
      "You can only schedule pickup for your own shipments."
    );
  }
  const eligibleStatuses = [
    ShipmentStatus.PENDING_APPROVAL,
    ShipmentStatus.CREATED,
    ShipmentStatus.PICKUP_ASSIGNED
  ];
  if (!eligibleStatuses.includes(shipment.status)) {
    throw new AppError(
      httpStatus14.BAD_REQUEST,
      `Cannot schedule or reschedule pickup. Current shipment status is '${shipment.status}'.`
    );
  }
  const scheduledDate = new Date(payload.scheduledPickupAt);
  if (Number.isNaN(scheduledDate.getTime())) {
    throw new AppError(
      httpStatus14.BAD_REQUEST,
      "Invalid date format for scheduledPickupAt."
    );
  }
  if (scheduledDate.getTime() < Date.now() - 5 * 60 * 1e3) {
    throw new AppError(
      httpStatus14.BAD_REQUEST,
      "Scheduled pickup time must be in the future."
    );
  }
  const updatedShipment = await prisma.$transaction(async (tx) => {
    const updated = await tx.shipment.update({
      where: { id: shipmentId },
      data: {
        scheduledPickupAt: scheduledDate
      },
      include: {
        pickupAddress: true,
        deliveryAddress: true
      }
    });
    await tx.shipmentStatusHistory.create({
      data: {
        shipmentId,
        status: shipment.status,
        location: "Customer Portal",
        note: `Pickup scheduled for ${scheduledDate.toISOString()}`,
        updatedBy: userId
      }
    });
    await tx.notification.create({
      data: {
        userId,
        shipmentId,
        title: "Pickup Scheduled",
        message: `Pickup for shipment ${shipment.trackingNumber} is scheduled for ${scheduledDate.toLocaleString()}.`,
        type: "PICKUP_SCHEDULED"
      }
    });
    return updated;
  });
  return updatedShipment;
};
var cancelShipment3 = async (userId, shipmentId, payload) => {
  const customer = await getCustomerByUserId(userId);
  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId }
  });
  if (!shipment) {
    throw new AppError(httpStatus14.NOT_FOUND, "Shipment not found.");
  }
  if (shipment.customerId !== customer.id) {
    throw new AppError(
      httpStatus14.FORBIDDEN,
      "You can only cancel your own shipments."
    );
  }
  if (shipment.status === ShipmentStatus.CANCELLED) {
    throw new AppError(httpStatus14.BAD_REQUEST, "Shipment is already cancelled.");
  }
  const postPickupStatuses = [
    ShipmentStatus.PICKED_UP,
    ShipmentStatus.AT_ORIGIN_HUB,
    ShipmentStatus.IN_TRANSIT,
    ShipmentStatus.AT_DESTINATION_HUB,
    ShipmentStatus.OUT_FOR_DELIVERY,
    ShipmentStatus.DELIVERED,
    ShipmentStatus.DELIVERY_FAILED,
    ShipmentStatus.RESCHEDULED,
    ShipmentStatus.RETURN_INITIATED,
    ShipmentStatus.RETURN_IN_TRANSIT,
    ShipmentStatus.RETURNED
  ];
  if (postPickupStatuses.includes(shipment.status)) {
    throw new AppError(
      httpStatus14.BAD_REQUEST,
      `Shipment cannot be cancelled after pickup has occurred. Current status is '${shipment.status}'. The package is already in transit with our logistics network. Please contact customer support to request a return or hold.`
    );
  }
  const cancellableStatuses = [
    ShipmentStatus.PENDING_APPROVAL,
    ShipmentStatus.CREATED,
    ShipmentStatus.COURIER_ASSIGNED,
    ShipmentStatus.PICKUP_ASSIGNED
  ];
  if (!cancellableStatuses.includes(shipment.status)) {
    throw new AppError(
      httpStatus14.BAD_REQUEST,
      `Shipment cannot be cancelled in its current state ('${shipment.status}').`
    );
  }
  const cancellationReason = payload.reason?.trim() || "Shipment cancelled by customer.";
  const cancelledShipment = await prisma.$transaction(async (tx) => {
    const updated = await tx.shipment.update({
      where: { id: shipmentId },
      data: {
        status: ShipmentStatus.CANCELLED
      },
      include: {
        pickupAddress: true,
        deliveryAddress: true
      }
    });
    await tx.courierParcel.updateMany({
      where: {
        shipmentId,
        status: {
          in: [AssignmentStatus.PENDING, AssignmentStatus.ACCEPTED]
        }
      },
      data: {
        status: AssignmentStatus.CANCELLED
      }
    });
    await tx.shipmentStatusHistory.create({
      data: {
        shipmentId,
        status: ShipmentStatus.CANCELLED,
        location: "Customer Portal",
        note: `Cancelled by customer. Reason: ${cancellationReason}`,
        updatedBy: userId
      }
    });
    await tx.notification.create({
      data: {
        userId,
        shipmentId,
        title: "Shipment Cancelled",
        message: `Shipment ${shipment.trackingNumber} has been successfully cancelled.`,
        type: "SHIPMENT_CANCELLED"
      }
    });
    return updated;
  });
  return cancelledShipment;
};
var getPricingRules = async () => {
  const rules = await prisma.pricingRule.findMany({
    where: {
      isActive: true
    },
    include: {
      zone: {
        select: {
          id: true,
          name: true,
          code: true
        }
      }
    },
    orderBy: [
      { deliveryType: "asc" },
      { minWeight: "asc" }
    ]
  });
  return rules;
};
var calculatePricing = async (payload) => {
  const weight = Number(payload.weight);
  const deliveryType = (payload.deliveryType || "STANDARD").toUpperCase();
  const whereConditions = {
    isActive: true,
    deliveryType,
    minWeight: { lte: weight },
    maxWeight: { gte: weight }
  };
  if (payload.zoneId) {
    whereConditions.zoneId = payload.zoneId;
  }
  const matchedRule = await prisma.pricingRule.findFirst({
    where: whereConditions,
    include: {
      zone: true
    }
  });
  if (matchedRule) {
    const baseCharge2 = Number(matchedRule.baseCharge);
    const perKgCharge2 = Number(matchedRule.perKgCharge);
    const minWeight = Number(matchedRule.minWeight);
    const extraWeight2 = Math.max(0, weight - minWeight);
    const additionalWeightCharge2 = Number((extraWeight2 * perKgCharge2).toFixed(2));
    const totalEstimatedCost2 = Number((baseCharge2 + additionalWeightCharge2).toFixed(2));
    return {
      weight,
      deliveryType,
      currency: "BDT",
      matchedRuleId: matchedRule.id,
      zone: matchedRule.zone?.name || null,
      baseCharge: baseCharge2,
      perKgCharge: perKgCharge2,
      additionalWeightCharge: additionalWeightCharge2,
      totalEstimatedCost: totalEstimatedCost2
    };
  }
  let baseCharge = 60;
  let perKgCharge = 20;
  if (deliveryType === "EXPRESS") {
    baseCharge = 120;
    perKgCharge = 35;
  } else if (deliveryType === "SAME_DAY") {
    baseCharge = 180;
    perKgCharge = 50;
  }
  const extraWeight = Math.max(0, weight - 1);
  const additionalWeightCharge = Number((extraWeight * perKgCharge).toFixed(2));
  const totalEstimatedCost = Number((baseCharge + additionalWeightCharge).toFixed(2));
  return {
    weight,
    deliveryType,
    currency: "BDT",
    matchedRuleId: null,
    zone: payload.pickupCity && payload.deliveryCity && payload.pickupCity.toLowerCase() === payload.deliveryCity.toLowerCase() ? "Same City" : "Inter-City Standard",
    baseCharge,
    perKgCharge,
    additionalWeightCharge,
    totalEstimatedCost,
    note: "Standard baseline rate estimate."
  };
};
var getDeliveryHistory = async (userId, query) => {
  const customer = await getCustomerByUserId(userId);
  const page = Number(query.page) > 0 ? Number(query.page) : 1;
  const limit = Number(query.limit) > 0 ? Number(query.limit) : 10;
  const skip = (page - 1) * limit;
  const whereConditions = {
    customerId: customer.id
  };
  if (query.status) {
    whereConditions.status = query.status;
  } else {
    whereConditions.status = {
      in: [
        ShipmentStatus.DELIVERED,
        ShipmentStatus.RETURNED,
        ShipmentStatus.CANCELLED
      ]
    };
  }
  if (query.startDate || query.endDate) {
    whereConditions.createdAt = {};
    if (query.startDate) {
      whereConditions.createdAt.gte = new Date(query.startDate);
    }
    if (query.endDate) {
      whereConditions.createdAt.lte = new Date(query.endDate);
    }
  }
  const sortBy = query.sortBy || "updatedAt";
  const sortOrder = query.sortOrder || "desc";
  const [history, total] = await Promise.all([
    prisma.shipment.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      },
      include: {
        pickupAddress: true,
        deliveryAddress: true,
        originHub: { select: { id: true, name: true, code: true } },
        destinationHub: { select: { id: true, name: true, code: true } },
        proofOfDelivery: true,
        payment: true,
        deliveryAttempts: {
          orderBy: { attemptNumber: "desc" },
          take: 1
        },
        statusHistory: {
          orderBy: { createdAt: "desc" },
          take: 3
        }
      }
    }),
    prisma.shipment.count({
      where: whereConditions
    })
  ]);
  return {
    data: history,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getMyInvoices = async (userId, query) => {
  const customer = await getCustomerByUserId(userId);
  const page = Number(query.page) > 0 ? Number(query.page) : 1;
  const limit = Number(query.limit) > 0 ? Number(query.limit) : 10;
  const skip = (page - 1) * limit;
  const whereConditions = {
    customerId: customer.id
  };
  if (query.paymentStatus) {
    whereConditions.paymentStatus = query.paymentStatus;
  }
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";
  const [shipments, total] = await Promise.all([
    prisma.shipment.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        payment: true,
        deliveryAddress: true
      }
    }),
    prisma.shipment.count({
      where: whereConditions
    })
  ]);
  const invoices = shipments.map((s) => ({
    invoiceNumber: `INV-${s.trackingNumber}`,
    shipmentId: s.id,
    trackingNumber: s.trackingNumber,
    parcelType: s.parcelType,
    weight: Number(s.weight),
    deliveryType: s.deliveryType,
    amount: Number(s.deliveryCharge),
    currency: s.payment?.currency || "BDT",
    paymentStatus: s.paymentStatus,
    paymentProvider: s.payment?.provider || "N/A",
    transactionId: s.payment?.transactionId || null,
    paidAt: s.payment?.paidAt || null,
    invoiceDate: s.createdAt,
    destinationCity: s.deliveryAddress.city
  }));
  return {
    data: invoices,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getInvoiceById = async (userId, identifier) => {
  const customer = await getCustomerByUserId(userId);
  const shipment = await prisma.shipment.findFirst({
    where: {
      customerId: customer.id,
      OR: [{ id: identifier }, { trackingNumber: identifier }]
    },
    include: {
      customer: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true
            }
          }
        }
      },
      pickupAddress: true,
      deliveryAddress: true,
      payment: true
    }
  });
  if (!shipment) {
    throw new AppError(httpStatus14.NOT_FOUND, "Invoice not found for this shipment.");
  }
  const deliveryCharge = Number(shipment.deliveryCharge);
  const currency = shipment.payment?.currency || "BDT";
  return {
    invoiceNumber: `INV-${shipment.trackingNumber}`,
    invoiceDate: shipment.createdAt,
    company: {
      name: "ParcelPilot Logistics Ltd.",
      address: "Dhaka, Bangladesh",
      email: "support@parcelpilot.com",
      phone: "+880 1700-000000"
    },
    customer: {
      name: shipment.customer.user.name,
      email: shipment.customer.user.email,
      phone: shipment.customer.user.phone
    },
    shipmentDetails: {
      shipmentId: shipment.id,
      trackingNumber: shipment.trackingNumber,
      parcelType: shipment.parcelType,
      weight: Number(shipment.weight),
      deliveryType: shipment.deliveryType,
      status: shipment.status,
      pickupAddress: `${shipment.pickupAddress.addressLine}, ${shipment.pickupAddress.area}, ${shipment.pickupAddress.city}`,
      deliveryAddress: `${shipment.deliveryAddress.addressLine}, ${shipment.deliveryAddress.area}, ${shipment.deliveryAddress.city}`
    },
    billing: {
      baseDeliveryCharge: deliveryCharge,
      tax: 0,
      totalAmount: deliveryCharge,
      currency,
      paymentStatus: shipment.paymentStatus,
      paymentProvider: shipment.payment?.provider || "Pending Provider",
      transactionId: shipment.payment?.transactionId || null,
      paidAt: shipment.payment?.paidAt || null
    }
  };
};
var reportDeliveryIssue = async (userId, shipmentId, payload) => {
  const customer = await getCustomerByUserId(userId);
  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId }
  });
  if (!shipment) {
    throw new AppError(httpStatus14.NOT_FOUND, "Shipment not found.");
  }
  if (shipment.customerId !== customer.id) {
    throw new AppError(
      httpStatus14.FORBIDDEN,
      "You can only report issues for your own shipments."
    );
  }
  const contactInfo = payload.contactPhone ? ` (Contact: ${payload.contactPhone})` : "";
  const issueNote = `[ISSUE_REPORTED:${payload.issueType}] ${payload.description}${contactInfo}`;
  const result = await prisma.$transaction(async (tx) => {
    const historyEntry = await tx.shipmentStatusHistory.create({
      data: {
        shipmentId,
        status: shipment.status,
        location: "Customer Issue Report",
        note: issueNote,
        updatedBy: userId
      }
    });
    await tx.notification.create({
      data: {
        userId,
        shipmentId,
        title: `Delivery Issue Reported: ${shipment.trackingNumber}`,
        message: `Your issue regarding '${payload.issueType}' has been logged and escalated to customer support.`,
        type: "DELIVERY_ISSUE"
      }
    });
    return historyEntry;
  });
  return {
    issueId: result.id,
    shipmentId,
    trackingNumber: shipment.trackingNumber,
    issueType: payload.issueType,
    description: payload.description,
    contactPhone: payload.contactPhone || null,
    reportedAt: result.createdAt,
    status: "OPEN",
    message: "Issue successfully recorded and escalated to operations team."
  };
};
var getShipmentIssues = async (userId, shipmentId) => {
  const customer = await getCustomerByUserId(userId);
  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId }
  });
  if (!shipment) {
    throw new AppError(httpStatus14.NOT_FOUND, "Shipment not found.");
  }
  if (shipment.customerId !== customer.id) {
    throw new AppError(
      httpStatus14.FORBIDDEN,
      "You can only view issues for your own shipments."
    );
  }
  const statusHistories = await prisma.shipmentStatusHistory.findMany({
    where: {
      shipmentId,
      note: {
        startsWith: "[ISSUE_REPORTED:"
      }
    },
    orderBy: { createdAt: "desc" }
  });
  return statusHistories.map((h) => {
    const match = h.note?.match(/\[ISSUE_REPORTED:([A-Z_]+)\]\s*(.*)/);
    const issueType = match ? match[1] : "UNKNOWN";
    const description = match ? match[2] : h.note;
    return {
      id: h.id,
      shipmentId: h.shipmentId,
      trackingNumber: shipment.trackingNumber,
      issueType,
      description,
      reportedAt: h.createdAt
    };
  });
};
var getMyReportedIssues = async (userId) => {
  const customer = await getCustomerByUserId(userId);
  const issues = await prisma.shipmentStatusHistory.findMany({
    where: {
      note: {
        startsWith: "[ISSUE_REPORTED:"
      },
      shipment: {
        customerId: customer.id
      }
    },
    include: {
      shipment: {
        select: {
          id: true,
          trackingNumber: true,
          status: true,
          deliveryType: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  return issues.map((h) => {
    const match = h.note?.match(/\[ISSUE_REPORTED:([A-Z_]+)\]\s*(.*)/);
    const issueType = match ? match[1] : "UNKNOWN";
    const description = match ? match[2] : h.note;
    return {
      id: h.id,
      shipmentId: h.shipmentId,
      trackingNumber: h.shipment.trackingNumber,
      shipmentStatus: h.shipment.status,
      deliveryType: h.shipment.deliveryType,
      issueType,
      description,
      reportedAt: h.createdAt
    };
  });
};
var UserService = {
  getProfile,
  updateProfile,
  getAllUsers: getAllUsers3,
  getUserById: getUserById3,
  updateUserStatus,
  addAddress,
  getMyAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  createShipmentRequest,
  getMyShipments,
  getShipmentById,
  trackShipment,
  schedulePickup,
  cancelShipment: cancelShipment3,
  getPricingRules,
  calculatePricing,
  getDeliveryHistory,
  getMyInvoices,
  getInvoiceById,
  reportDeliveryIssue,
  getShipmentIssues,
  getMyReportedIssues
};

// src/app/module/user/user.controller.ts
var getProfile2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus15.UNAUTHORIZED,
      "User information is missing from request context."
    );
  }
  const result = await UserService.getProfile(user.userId);
  sendResponse(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "User profile fetched successfully.",
    data: result
  });
});
var updateProfile2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus15.UNAUTHORIZED,
      "User information is missing from request context."
    );
  }
  const result = await UserService.updateProfile(user.userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "Profile updated successfully.",
    data: result
  });
});
var getAllUsers4 = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsers(req.query);
  sendResponse(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "Users fetched successfully.",
    data: result.data,
    meta: result.meta
  });
});
var getUserById4 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.getUserById(id);
  sendResponse(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "User fetched successfully.",
    data: result
  });
});
var updateUserStatus2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.updateUserStatus(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "User status updated successfully.",
    data: result
  });
});
var addAddress2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus15.UNAUTHORIZED,
      "User information is missing from request context."
    );
  }
  const result = await UserService.addAddress(user.userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus15.CREATED,
    success: true,
    message: "Address added successfully.",
    data: result
  });
});
var getMyAddresses2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus15.UNAUTHORIZED,
      "User information is missing from request context."
    );
  }
  const result = await UserService.getMyAddresses(user.userId);
  sendResponse(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "Addresses fetched successfully.",
    data: result
  });
});
var getAddressById2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus15.UNAUTHORIZED,
      "User information is missing from request context."
    );
  }
  const { id } = req.params;
  const result = await UserService.getAddressById(
    user.userId,
    id,
    user.role
  );
  sendResponse(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "Address retrieved successfully.",
    data: result
  });
});
var updateAddress2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus15.UNAUTHORIZED,
      "User information is missing from request context."
    );
  }
  const { id } = req.params;
  const result = await UserService.updateAddress(
    user.userId,
    id,
    req.body,
    user.role
  );
  sendResponse(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "Address updated successfully.",
    data: result
  });
});
var deleteAddress2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus15.UNAUTHORIZED,
      "User information is missing from request context."
    );
  }
  const { id } = req.params;
  const result = await UserService.deleteAddress(
    user.userId,
    id,
    user.role
  );
  sendResponse(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "Address deleted successfully.",
    data: result
  });
});
var createShipmentRequest2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      throw new AppError(
        httpStatus15.UNAUTHORIZED,
        "User information is missing from request context."
      );
    }
    const result = await UserService.createShipmentRequest(
      user.userId,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus15.CREATED,
      success: true,
      message: "Shipment request created successfully.",
      data: result
    });
  }
);
var getMyShipments2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus15.UNAUTHORIZED,
      "User information is missing from request context."
    );
  }
  const result = await UserService.getMyShipments(user.userId, req.query);
  sendResponse(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "Shipment requests retrieved successfully.",
    data: result.data,
    meta: result.meta
  });
});
var getShipmentById2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus15.UNAUTHORIZED,
      "User information is missing from request context."
    );
  }
  const { id } = req.params;
  const result = await UserService.getShipmentById(
    user.userId,
    id,
    user.role
  );
  sendResponse(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "Shipment retrieved successfully.",
    data: result
  });
});
var trackShipment2 = catchAsync(async (req, res) => {
  const { trackingNumber } = req.params;
  const user = req.user;
  const result = await UserService.trackShipment(
    trackingNumber,
    user?.userId
  );
  sendResponse(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "Shipment tracking details retrieved successfully.",
    data: result
  });
});
var schedulePickup2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus15.UNAUTHORIZED,
      "User information is missing from request context."
    );
  }
  const { id } = req.params;
  const result = await UserService.schedulePickup(
    user.userId,
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "Pickup scheduled successfully.",
    data: result
  });
});
var cancelShipment4 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus15.UNAUTHORIZED,
      "User information is missing from request context."
    );
  }
  const { id } = req.params;
  const result = await UserService.cancelShipment(
    user.userId,
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "Shipment cancelled successfully.",
    data: result
  });
});
var getPricingRules2 = catchAsync(async (_req, res) => {
  const result = await UserService.getPricingRules();
  sendResponse(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "Active pricing rules retrieved successfully.",
    data: result
  });
});
var calculatePricing2 = catchAsync(async (req, res) => {
  const result = await UserService.calculatePricing(req.body);
  sendResponse(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "Estimated pricing calculated successfully.",
    data: result
  });
});
var getDeliveryHistory2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus15.UNAUTHORIZED,
      "User information is missing from request context."
    );
  }
  const result = await UserService.getDeliveryHistory(
    user.userId,
    req.query
  );
  sendResponse(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "Delivery history retrieved successfully.",
    data: result.data,
    meta: result.meta
  });
});
var getMyInvoices2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus15.UNAUTHORIZED,
      "User information is missing from request context."
    );
  }
  const result = await UserService.getMyInvoices(user.userId, req.query);
  sendResponse(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "Invoices retrieved successfully.",
    data: result.data,
    meta: result.meta
  });
});
var getInvoiceById2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus15.UNAUTHORIZED,
      "User information is missing from request context."
    );
  }
  const { id } = req.params;
  const result = await UserService.getInvoiceById(user.userId, id);
  sendResponse(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "Invoice retrieved successfully.",
    data: result
  });
});
var reportDeliveryIssue2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus15.UNAUTHORIZED,
      "User information is missing from request context."
    );
  }
  const { id } = req.params;
  const result = await UserService.reportDeliveryIssue(
    user.userId,
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus15.CREATED,
    success: true,
    message: "Delivery issue reported successfully.",
    data: result
  });
});
var getShipmentIssues2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus15.UNAUTHORIZED,
      "User information is missing from request context."
    );
  }
  const { id } = req.params;
  const result = await UserService.getShipmentIssues(
    user.userId,
    id
  );
  sendResponse(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "Shipment issues retrieved successfully.",
    data: result
  });
});
var getMyReportedIssues2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus15.UNAUTHORIZED,
      "User information is missing from request context."
    );
  }
  const result = await UserService.getMyReportedIssues(user.userId);
  sendResponse(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "All reported delivery issues retrieved successfully.",
    data: result
  });
});
var UserController = {
  getProfile: getProfile2,
  updateProfile: updateProfile2,
  getAllUsers: getAllUsers4,
  getUserById: getUserById4,
  updateUserStatus: updateUserStatus2,
  addAddress: addAddress2,
  getMyAddresses: getMyAddresses2,
  getAddressById: getAddressById2,
  updateAddress: updateAddress2,
  deleteAddress: deleteAddress2,
  createShipmentRequest: createShipmentRequest2,
  getMyShipments: getMyShipments2,
  getShipmentById: getShipmentById2,
  trackShipment: trackShipment2,
  schedulePickup: schedulePickup2,
  cancelShipment: cancelShipment4,
  getPricingRules: getPricingRules2,
  calculatePricing: calculatePricing2,
  getDeliveryHistory: getDeliveryHistory2,
  getMyInvoices: getMyInvoices2,
  getInvoiceById: getInvoiceById2,
  reportDeliveryIssue: reportDeliveryIssue2,
  getShipmentIssues: getShipmentIssues2,
  getMyReportedIssues: getMyReportedIssues2
};

// src/app/module/user/user.validation.ts
import { z as z6 } from "zod";
var CreateAddressZodSchema = z6.object({
  label: z6.string().max(50).optional(),
  addressLine: z6.string().trim().min(3, "Address line must be at least 3 characters long"),
  city: z6.string().trim().min(2, "City must be at least 2 characters long"),
  area: z6.string().trim().min(2, "Area must be at least 2 characters long"),
  postalCode: z6.string().max(20).optional(),
  latitude: z6.number().optional(),
  longitude: z6.number().optional()
});
var UpdateAddressZodSchema = z6.object({
  label: z6.string().max(50).optional(),
  addressLine: z6.string().trim().min(3).optional(),
  city: z6.string().trim().min(2).optional(),
  area: z6.string().trim().min(2).optional(),
  postalCode: z6.string().max(20).optional(),
  latitude: z6.number().optional(),
  longitude: z6.number().optional()
});
var UpdateProfileZodSchema = z6.object({
  name: z6.string().min(3, "Name must be at least 3 characters long").max(100).optional(),
  phone: z6.string().min(6, "Phone must be at least 6 characters").max(50).optional()
});
var UpdateUserStatusZodSchema = z6.object({
  status: z6.nativeEnum(UserStatus, {
    message: "Invalid user status"
  }).optional(),
  role: z6.nativeEnum(UserRole, {
    message: "Invalid user role"
  }).optional()
});
var CreateShipmentRequestZodSchema = z6.object({
  pickupAddress: CreateAddressZodSchema.optional(),
  pickupAddressId: z6.string().uuid("Invalid pickup address ID").optional(),
  deliveryAddress: CreateAddressZodSchema.optional(),
  deliveryAddressId: z6.string().uuid("Invalid delivery address ID").optional(),
  recipientName: z6.string().trim().min(2, "Recipient name must be at least 2 characters long").max(100, "Recipient name cannot exceed 100 characters").optional(),
  recipientPhone: z6.string().trim().regex(
    /^(?:\+?8801[3-9]\d{8}|01[3-9]\d{8}|\+?[1-9]\d{7,14})$/,
    "Invalid recipient phone number format. Must be a valid phone number (e.g., +8801XXXXXXXXX or 01XXXXXXXXX)."
  ).optional(),
  parcelType: z6.string().trim().min(1, "Parcel type is required"),
  weight: z6.number({
    message: "Weight must be a valid number"
  }).gt(0, "Weight must be greater than zero. Zero or negative weight is not allowed.").min(0.05, "Minimum parcel weight is 0.05 kg (50 grams).").max(500, "Maximum parcel weight allowed is 500 kg. For heavier cargo, please contact freight support."),
  description: z6.string().max(1e3).optional(),
  deliveryType: z6.string().optional().default("STANDARD"),
  scheduledPickupAt: z6.string().optional()
}).refine((data) => Boolean(data.pickupAddress || data.pickupAddressId), {
  message: "Missing pickup address. Please provide either 'pickupAddress' details or a saved 'pickupAddressId'.",
  path: ["pickupAddress"]
}).refine((data) => Boolean(data.deliveryAddress || data.deliveryAddressId), {
  message: "Missing delivery address. Please provide either 'deliveryAddress' details or a saved 'deliveryAddressId'.",
  path: ["deliveryAddress"]
});
var SchedulePickupZodSchema = z6.object({
  scheduledPickupAt: z6.string().min(1, "Scheduled pickup date/time is required")
});
var CancelShipmentZodSchema2 = z6.object({
  reason: z6.string().max(500, "Reason cannot exceed 500 characters").optional()
});
var CalculatePricingZodSchema = z6.object({
  weight: z6.number({
    message: "Weight must be a valid number"
  }).gt(0, "Weight must be greater than zero. Zero or negative weight is not allowed.").min(0.05, "Minimum parcel weight is 0.05 kg.").max(500, "Maximum parcel weight allowed is 500 kg."),
  deliveryType: z6.string().optional().default("STANDARD"),
  zoneId: z6.string().uuid("Invalid zone ID").optional(),
  pickupCity: z6.string().optional(),
  deliveryCity: z6.string().optional()
});
var ReportDeliveryIssueZodSchema = z6.object({
  issueType: z6.enum(
    [
      "DELAYED_DELIVERY",
      "DAMAGED_PARCEL",
      "WRONG_ADDRESS",
      "COURIER_UNREACHABLE",
      "PACKAGE_LOST",
      "INCORRECT_STATUS",
      "BILLING_ISSUE",
      "OTHER"
    ],
    {
      message: "Invalid issue type"
    }
  ),
  description: z6.string().min(5, "Description must be at least 5 characters long").max(1e3, "Description cannot exceed 1000 characters"),
  contactPhone: z6.string().max(50).optional()
});
var UserValidation2 = {
  CreateAddressZodSchema,
  UpdateAddressZodSchema,
  UpdateProfileZodSchema,
  UpdateUserStatusZodSchema,
  CreateShipmentRequestZodSchema,
  SchedulePickupZodSchema,
  CancelShipmentZodSchema: CancelShipmentZodSchema2,
  CalculatePricingZodSchema,
  ReportDeliveryIssueZodSchema
};

// src/app/module/user/user.router.ts
var router6 = Router6();
router6.get("/me", auth(), UserController.getProfile);
router6.get("/profile", auth(), UserController.getProfile);
router6.patch(
  "/profile",
  auth(),
  validateRequest(UserValidation2.UpdateProfileZodSchema),
  UserController.updateProfile
);
router6.post(
  "/address",
  auth(UserRole.CUSTOMER),
  validateRequest(UserValidation2.CreateAddressZodSchema),
  UserController.addAddress
);
router6.get("/address", auth(UserRole.CUSTOMER), UserController.getMyAddresses);
router6.get(
  "/address/:id",
  auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.OPERATIONS_MANAGER),
  UserController.getAddressById
);
router6.patch(
  "/address/:id",
  auth(UserRole.CUSTOMER, UserRole.ADMIN),
  validateRequest(UserValidation2.UpdateAddressZodSchema),
  UserController.updateAddress
);
router6.delete(
  "/address/:id",
  auth(UserRole.CUSTOMER, UserRole.ADMIN),
  UserController.deleteAddress
);
router6.get("/pricing", UserController.getPricingRules);
router6.post(
  "/pricing/calculate",
  validateRequest(UserValidation2.CalculatePricingZodSchema),
  UserController.calculatePricing
);
router6.get("/invoices", auth(UserRole.CUSTOMER), UserController.getMyInvoices);
router6.get(
  "/invoices/:id",
  auth(UserRole.CUSTOMER),
  UserController.getInvoiceById
);
router6.get(
  "/delivery-issues",
  auth(UserRole.CUSTOMER),
  UserController.getMyReportedIssues
);
router6.post(
  "/create-shipment-request",
  auth(UserRole.CUSTOMER),
  validateRequest(UserValidation2.CreateShipmentRequestZodSchema),
  UserController.createShipmentRequest
);
router6.get(
  "/shipments/track/:trackingNumber",
  UserController.trackShipment
);
router6.get(
  "/track/:trackingNumber",
  UserController.trackShipment
);
router6.get(
  "/shipments/history",
  auth(UserRole.CUSTOMER),
  UserController.getDeliveryHistory
);
router6.get(
  "/delivery-history",
  auth(UserRole.CUSTOMER),
  UserController.getDeliveryHistory
);
router6.get(
  "/shipments",
  auth(UserRole.CUSTOMER),
  UserController.getMyShipments
);
router6.get(
  "/shipments/:id",
  auth(
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.OPERATIONS_MANAGER,
    UserRole.HUB_MANAGER
  ),
  UserController.getShipmentById
);
router6.patch(
  "/shipments/:id/schedule-pickup",
  auth(UserRole.CUSTOMER),
  validateRequest(UserValidation2.SchedulePickupZodSchema),
  UserController.schedulePickup
);
router6.patch(
  "/shipments/:id/cancel",
  auth(UserRole.CUSTOMER),
  validateRequest(UserValidation2.CancelShipmentZodSchema),
  UserController.cancelShipment
);
router6.post(
  "/shipments/:id/report-issue",
  auth(UserRole.CUSTOMER),
  validateRequest(UserValidation2.ReportDeliveryIssueZodSchema),
  UserController.reportDeliveryIssue
);
router6.get(
  "/shipments/:id/issues",
  auth(UserRole.CUSTOMER),
  UserController.getShipmentIssues
);
router6.get(
  "/shipments/:id/invoice",
  auth(UserRole.CUSTOMER),
  UserController.getInvoiceById
);
router6.get(
  "/",
  auth(UserRole.ADMIN, UserRole.OPERATIONS_MANAGER),
  UserController.getAllUsers
);
router6.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.OPERATIONS_MANAGER),
  UserController.getUserById
);
router6.patch(
  "/:id/status",
  auth(UserRole.ADMIN),
  validateRequest(UserValidation2.UpdateUserStatusZodSchema),
  UserController.updateUserStatus
);
var UserRoutes = router6;

// src/app.ts
BigInt.prototype.toJSON = function() {
  return this.toString();
};
var app = express2();
app.use(
  cors({
    // origin: config.frontend_url,
    credentials: true
  })
);
app.use(express2.urlencoded({ extended: true }));
app.use(
  express2.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    }
  })
);
app.use(cookieParser());
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/operations-manager", OperationsManagerRoutes);
app.use("/api/v1/courier", CourierRoutes);
app.use("/api/v1/payment", PaymentRoutes);
app.use("/api/v1/admin", AdminRoutes);
app.get("/", async (_req, res) => {
  res.status(httpStatus16.OK).json({
    success: true,
    message: "Welcome to ParcelPilot"
  });
});
app.use(globalErrorHandler);
var app_default = app;
export {
  app_default as default
};
