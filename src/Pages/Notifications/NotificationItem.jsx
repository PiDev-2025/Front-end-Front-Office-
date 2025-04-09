import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  IoCheckmarkCircle,
  IoAlertCircle,
  IoInformationCircle,
  IoNotifications,
} from "react-icons/io5";
import React, { useState, useEffect } from "react";
import axios from "axios";

const ParkingReservationNotification = ({ notification, onMarkAsRead }) => {
  const driver = notification.driverId || {};
  const parking = notification.parkingId || {};
  const reservation = notification.reservationId || {};

  if (!driver.email || !parking.name || !reservation.startTime) {
    return (
      <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 rounded-md">
        Données de réservation incomplètes
      </div>
    );
  }

  const handleResponse = async (response) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3001/api/reservations/${reservation._id}/status`,
        { status: response },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Mettre à jour l'état local si nécessaire
      onMarkAsRead(notification._id, response);
    } catch (err) {
      console.error("Erreur lors de la réponse:", err);
    }
  };

  const formattedStartDate = format(
    new Date(reservation.startTime),
    "dd MMMM yyyy à HH:mm",
    { locale: fr }
  );
  const formattedEndDate = format(
    new Date(reservation.endTime),
    "dd MMMM yyyy à HH:mm",
    { locale: fr }
  );

  const startTime = new Date(reservation.startTime);
  const endTime = new Date(reservation.endTime);
  const durationHours = Math.round((endTime - startTime) / (1000 * 60 * 60));

  // Déterminer le contenu à afficher en fonction du statut
  const renderActionButtons = () => {
    
    if (
      reservation.status === "canceled"
    ) {
      return (   
        <div className="p-2 bg-[#4b3f7a] border border-green-200 rounded-md hover:bg-red-600 text-white text-center transition-colors shadow-sm">
          <IoCheckmarkCircle className="inline-block mr-2" />
          Reservation Canceled
        </div>
      );
    } else if (
      reservation.status === "accepted" ||
      notification.status === "acceptée"
    ) {
      return (   
        <div className="p-2 bg-[#338a15] border border-green-200 rounded-md hover:bg-red-600 text-white text-center transition-colors shadow-sm">
          <IoCheckmarkCircle className="inline-block mr-2" />
          Reservation Accepted
        </div>
      );
    } else if (
      reservation.status === "rejected" ||
      notification.status === "refusée"
    ) {
      return (
        <div className="p-2 bg-[#e13105] border border-green-200 rounded-md hover:bg-red-600 text-white text-center transition-colors shadow-sm">
          <IoAlertCircle className="inline-block mr-2 text-red-500" />
          Reservation Rejected
        </div>
      );
    } else {
      // Si le statut est "pending" ou "en_attente", afficher les boutons
      return (
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => handleResponse("rejected")}
            className="px-4 py-2 text-sm font-medium bg-[#fe1d27] text-white rounded-md hover:bg-red-600 transition-colors shadow-sm"
          >
            Refuser
          </button>

          <button
            onClick={() => handleResponse("accepted")}
            className="px-4 py-2 text-sm font-medium bg-[#3fd30c] text-white rounded-md hover:bg-green-600 transition-colors shadow-sm"
          >
            Accepter
          </button>
        </div>
      );
    }
  };

  return (
    <div
      className={`p-4 mb-3 rounded-lg border ${
        notification.isRead
          ? "bg-white border-gray-200"
          : "bg-[#d4d6e5] border-blue-300 shadow-md"
      } transition-all duration-200 w-full`}
    >
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-gray-800 text-lg">
            Demande réservation
          </h3>
        </div>

        <div className="mb-3">
          <div className="font-medium">Driver: {driver.name}</div>

          <div className="font-medium">
            Price:{" "}
            <span className="text-gray-500 text-sm">
              {reservation.totalPrice !== undefined &&
              reservation.totalPrice !== null
                ? `${reservation.totalPrice}Dt`
                : `${parking.pricing.hourly}Dt`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
          <div className="p-2 bg-white rounded border border-gray-200">
            <div className="text-xs text-gray-500">Début</div>
            <div className="font-medium">{formattedStartDate}</div>
          </div>

          <div className="p-2 bg-white rounded border border-gray-200">
            <div className="text-xs text-gray-500">Fin</div>
            <div className="font-medium">{formattedEndDate}</div>
          </div>

          <div className="p-2 bg-white rounded border border-gray-200">
            <div className="text-xs text-gray-500">Durée</div>
            <div className="font-medium">{durationHours} heures</div>
          </div>
        </div>

        {renderActionButtons()}
      </div>
    </div>
  );
};

const NotificationItem = ({ notification, onResponse }) => {
  // Vérifier si c'est une notification de réservation de parking
  if (
    notification.parkingId &&
    notification.driverId &&
    notification.reservationId
  ) {
    return (
      <ParkingReservationNotification
        notification={notification}
        onMarkAsRead={onResponse}
      />
    );
  }

  // Logique existante pour les autres types de notifications
  const getIcon = () => {
    if (notification.importance === "high") {
      return <IoAlertCircle className="text-red-500 text-2xl" />;
    } else if (notification.type === "reservation") {
      return <IoCheckmarkCircle className="text-green-500 text-2xl" />;
    } else {
      return <IoInformationCircle className="text-blue-500 text-2xl" />;
    }
  };

  // Formater la date
  const formattedDate = format(
    new Date(notification.createdAt),
    "dd MMMM yyyy à HH:mm",
    { locale: fr }
  );

  return (
    <div
      className={`p-4 mb-2 rounded-lg flex items-start ${
        notification.isRead
          ? "bg-white border-gray-200"
          : "bg-[#33fff0] border-l-4 border-blue-500 shadow-md"
      }`}
    >
      <div className="mr-3 mt-1">{getIcon()}</div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-bold text-gray-800">
            {notification.title || "Notification"}
          </h3>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
        <p className="text-gray-600 mb-2">
          {notification.message ||
            notification.messageRequested ||
            "Aucun message"}
        </p>
      </div>
    </div>
  );
};

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fonction pour charger les notifications
  const loadNotifications = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Vous devez être connecté pour voir vos notifications");
        setLoading(false);
        return;
      }

      // Paramètres pour l'API
      const params = new URLSearchParams({
        page: pageNum,
        limit: 10,
        onlyUnread: showOnlyUnread,
      });

      const response = await axios.get(
        `http://localhost:3001/api/notifications/all?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const {
        notifications: newNotifications,
        totalPages,
        total,
      } = response.data;

      if (reset) {
        setNotifications(newNotifications);
      } else {
        setNotifications((prev) => [...prev, ...newNotifications]);
      }

      setHasMore(pageNum < totalPages);
      setPage(pageNum);
      setUnreadCount(response.data.total);
      setError(null);
    } catch (err) {
      console.error("Erreur lors du chargement des notifications:", err);
      setError("Erreur lors du chargement des notifications");
    } finally {
      setLoading(false);
    }
  };

  // Charger les notifications au montage du composant
  useEffect(() => {
    loadNotifications(1, true);
  }, [showOnlyUnread]);

  // Fonction pour marquer une notification comme lue
  const handleMarkAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError(
          "Vous devez être connecté pour marquer une notification comme lue"
        );
        return;
      }

      await axios.patch(
        `http://localhost:3001/api/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Mettre à jour l'interface utilisateur
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );

      // Mettre à jour le compteur de notifications non lues
      setUnreadCount((prev) => prev - 1);
    } catch (err) {
      console.error("Erreur lors du marquage de la notification:", err);
      setError("Erreur lors du marquage de la notification comme lue");
    }
  };

  // Fonction pour marquer toutes les notifications comme lues
  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError(
          "Vous devez être connecté pour marquer les notifications comme lues"
        );
        return;
      }

      await axios.patch(
        "http://localhost:3001/api/notifications/read-all",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Mettre à jour l'interface utilisateur
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );

      // Mettre à jour le compteur de notifications non lues
      setUnreadCount(0);
    } catch (err) {
      console.error("Erreur lors du marquage des notifications:", err);
      setError("Erreur lors du marquage des notifications comme lues");
    }
  };

  // Fonction pour charger plus de notifications
  const loadMore = () => {
    if (!loading && hasMore) {
      loadNotifications(page + 1);
    }
  };

  const handleResponse = async (notificationId, response) => {
    try {

      // Mettre à jour l'état local
      setNotifications((prev) =>
        prev.map((n) => {
          if (n._id === notificationId) {
            // Mettre à jour à la fois le statut de la notification et celui de la réservation
            return {
              ...n,
              isRead: true,
              status: response === "accepted" ? "acceptée" : "refusée",
              reservationId: {
                ...n.reservationId,
                status: response,
              },
            };
          }
          return n;
        })
      );
    } catch (err) {
      console.error("Erreur lors de la réponse:", err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 max-w-2xl mx-auto overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <IoNotifications className="mr-2 text-blue-500" />
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {unreadCount}
            </span>
          )}
        </h2>

        <div className="flex space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
            >
              Tout marquer comme lu
            </button>
          )}
        </div>
      </div>

      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Aucune notification à afficher</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onResponse={handleResponse}
            />
          ))}

          {hasMore && (
            <div className="text-center mt-4">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
              >
                {loading ? "Chargement..." : "Charger plus"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const NotificationBadge = ({ onClick }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Charger le nombre de notifications non lues
  const loadUnreadCount = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      // Paramètres pour compter seulement les notifications non lues
      const params = new URLSearchParams({
        page: 1,
        limit: 1,
        onlyUnread: true,
      });

      const response = await axios.get(
        `http://localhost:3001/api/notifications/all?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUnreadCount(response.data.total);
    } catch (err) {
      console.error("Erreur lors du chargement des notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // Charger au montage et configurer un intervalle pour rafraîchir
  useEffect(() => {
    loadUnreadCount();

    // Rafraîchir toutes les minutes
    const interval = setInterval(loadUnreadCount, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-full hover:bg-gray-100"
      aria-label="Notifications"
    >
      <IoNotifications className="text-xl" />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
};

export { NotificationList, NotificationItem, NotificationBadge };