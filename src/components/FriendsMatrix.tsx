import React, { useState } from 'react';
import { 
  UserPlus, 
  Users, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Lock, 
  Unlock, 
  LogIn, 
  ShieldCheck, 
  UserCheck, 
  AlertTriangle 
} from 'lucide-react';
import { User } from 'firebase/auth';
import confetti from 'canvas-confetti';
import { Friend, DrinkCategoryKey, CalculationResult } from '../types';
import { CATEGORY_METADATA } from '../data/initialProducts';
import { formatCLP } from '../utils/calculator';

interface FriendsMatrixProps {
  friends: Friend[];
  calculation: CalculationResult;
  currentUser: User | null;
  adminUid?: string;
  onUpdateFriends: (friends: Friend[]) => void;
  onLoginGoogle: () => void;
}

export const FriendsMatrix: React.FC<FriendsMatrixProps> = ({
  friends,
  calculation,
  currentUser,
  adminUid,
  onUpdateFriends,
  onLoginGoogle,
}) => {
  const [newFriendName, setNewFriendName] = useState('');

  const categories: DrinkCategoryKey[] = ['pisco', 'gin', 'cerveza', 'terremoto', 'tequila', 'comun'];

  const isAdmin = Boolean(currentUser && adminUid && currentUser.uid === adminUid);
  const myLinkedFriend = currentUser ? friends.find((f) => f.userId === currentUser.uid) : null;

  const canEditFriend = (friend: Friend): boolean => {
    if (!currentUser) return false;
    if (isAdmin) return true;
    return friend.userId === currentUser.uid;
  };

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onLoginGoogle();
      return;
    }
    if (!newFriendName.trim()) return;

    const newFriend: Friend = {
      id: `friend-${Date.now()}`,
      name: newFriendName.trim(),
      userId: !myLinkedFriend ? currentUser.uid : undefined,
      userEmail: !myLinkedFriend ? currentUser.email || undefined : undefined,
      avatar: !myLinkedFriend ? currentUser.photoURL || undefined : undefined,
      drinks: {
        pisco: true,
        gin: false,
        cerveza: true,
        terremoto: true,
        tequila: false,
        comun: true,
      },
      hasPaid: false,
    };

    onUpdateFriends([...friends, newFriend]);
    setNewFriendName('');
  };

  const handleClaimCard = (friendId: string) => {
    if (!currentUser) {
      onLoginGoogle();
      return;
    }

    const updated = friends.map((f) => {
      if (f.id === friendId) {
        return {
          ...f,
          userId: currentUser.uid,
          userEmail: currentUser.email || undefined,
          avatar: currentUser.photoURL || undefined,
        };
      }
      return f;
    });

    onUpdateFriends(updated);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleUnlinkCard = (friendId: string) => {
    const updated = friends.map((f) => {
      if (f.id === friendId) {
        return {
          ...f,
          userId: undefined,
          userEmail: undefined,
          avatar: undefined,
        };
      }
      return f;
    });
    onUpdateFriends(updated);
  };

  const handleToggleDrink = (friend: Friend, category: DrinkCategoryKey) => {
    if (!currentUser) {
      onLoginGoogle();
      return;
    }

    if (!canEditFriend(friend)) {
      alert(`Solo ${friend.name} puede modificar sus propios tragos.`);
      return;
    }

    const updated = friends.map((f) => {
      if (f.id === friend.id) {
        return {
          ...f,
          drinks: {
            ...f.drinks,
            [category]: !f.drinks[category],
          },
        };
      }
      return f;
    });
    onUpdateFriends(updated);
  };

  const handleTogglePaid = (friend: Friend) => {
    if (!currentUser) {
      onLoginGoogle();
      return;
    }

    if (!isAdmin && friend.userId !== currentUser.uid) {
      alert('Solo el Organizador o el titular pueden actualizar el estado de pago.');
      return;
    }

    const updated = friends.map((f) => {
      if (f.id === friend.id) {
        const nextPaid = !f.hasPaid;
        if (nextPaid) {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#D52B1E', '#0039A6', '#FFFFFF', '#F59E0B'],
          });
        }
        return { ...f, hasPaid: nextPaid };
      }
      return f;
    });
    onUpdateFriends(updated);
  };

  const handleDeleteFriend = (friend: Friend) => {
    if (!currentUser) {
      onLoginGoogle();
      return;
    }

    if (!isAdmin && friend.userId !== currentUser.uid) {
      alert('Solo el Organizador o el dueño de la tarjeta pueden eliminarla.');
      return;
    }

    const updated = friends.filter((f) => f.id !== friend.id);
    onUpdateFriends(updated);
  };

  const handleApplyPreset = (friend: Friend, preset: 'all' | 'pisco-only' | 'gin-only' | 'terremoto-chela' | 'driver') => {
    if (!canEditFriend(friend)) {
      if (!currentUser) onLoginGoogle();
      return;
    }

    const updated = friends.map((f) => {
      if (f.id === friend.id) {
        let drinks = { ...f.drinks };
        switch (preset) {
          case 'all':
            drinks = { pisco: true, gin: true, cerveza: true, terremoto: true, tequila: true, comun: true };
            break;
          case 'pisco-only':
            drinks = { pisco: true, gin: false, cerveza: false, terremoto: false, tequila: false, comun: true };
            break;
          case 'gin-only':
            drinks = { pisco: false, gin: true, cerveza: false, terremoto: false, tequila: false, comun: true };
            break;
          case 'terremoto-chela':
            drinks = { pisco: false, gin: false, cerveza: true, terremoto: true, tequila: false, comun: true };
            break;
          case 'driver':
            drinks = { pisco: false, gin: false, cerveza: false, terremoto: false, tequila: false, comun: true };
            break;
        }
        return { ...f, drinks };
      }
      return f;
    });
    onUpdateFriends(updated);
  };

  const getFriendShare = (friendId: string) => {
    return calculation.friendShares.find((s) => s.friend.id === friendId);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
      
      {/* Non-verified Warning Banner */}
      {!currentUser && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-200">
                Modo Sólo Lectura (No Verificado)
              </h4>
              <p className="text-xs text-amber-300/80">
                Inicia sesión con tu cuenta de Google para poder marcar lo que vas a tomar o vincular tu perfil.
              </p>
            </div>
          </div>
          <button
            onClick={onLoginGoogle}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-md transition-all shrink-0"
          >
            <LogIn className="w-4 h-4 text-red-600" />
            <span>Entrar con Google</span>
          </button>
        </div>
      )}

      {/* Header & Add Friend */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                ¿Quién toma qué? (Votación y Asignación)
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {friends.length} amigos
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {currentUser 
                  ? 'Cada amigo solo puede modificar su propia tarjeta de copete.' 
                  : 'Debes iniciar sesión con Google para seleccionar tus licores.'}
              </p>
            </div>
          </div>
        </div>

        {/* Add Friend Input Form (Only for logged in users) */}
        {currentUser && (
          <form onSubmit={handleAddFriend} className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Nombre del amigo (ej. Nico)..."
                value={newFriendName}
                onChange={(e) => setNewFriendName(e.target.value)}
                className="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/30 transition-all shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Agregar</span>
            </button>
          </form>
        )}
      </div>

      {/* Friends Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        {friends.map((friend) => {
          const share = getFriendShare(friend.id);
          const totalCuota = share?.totalToPay || 0;
          const isMyCard = Boolean(currentUser && friend.userId === currentUser.uid);
          const isClaimed = Boolean(friend.userId);
          const editable = canEditFriend(friend);

          return (
            <div
              key={friend.id}
              className={`rounded-2xl p-4 sm:p-5 border transition-all duration-200 relative ${
                isMyCard
                  ? 'bg-blue-950/30 border-blue-500/80 ring-2 ring-blue-500/20 shadow-xl'
                  : friend.hasPaid
                  ? 'bg-emerald-950/20 border-emerald-800/60 shadow-lg shadow-emerald-950/20'
                  : 'bg-slate-800/60 hover:bg-slate-800/90 border-slate-700/80 shadow-md'
              }`}
            >
              {/* Ownership & Status Badge */}
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-700/50">
                <div className="flex items-center gap-2.5">
                  {friend.avatar ? (
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-9 h-9 rounded-full ring-2 ring-blue-500/60 shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow ring-1 ring-white/20 shrink-0">
                      {friend.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-white">
                        {friend.name}
                      </h3>
                      {isMyCard && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-500 text-white shadow-sm">
                          TÚ
                        </span>
                      )}
                      {isAdmin && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                          ORGANIZADOR
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5">
                      {isClaimed ? (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                          <UserCheck className="w-3 h-3" /> Verificado con Google
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Sin vincular
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Paid status button */}
                  <button
                    onClick={() => handleTogglePaid(friend)}
                    disabled={!currentUser || (!isAdmin && !isMyCard)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      friend.hasPaid
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 disabled:opacity-60 disabled:cursor-not-allowed'
                    }`}
                    title={friend.hasPaid ? 'Marcar como pendiente' : 'Marcar como pagado'}
                  >
                    {friend.hasPaid ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Pagado</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-3.5 h-3.5 text-slate-500" />
                        <span>Por pagar</span>
                      </>
                    )}
                  </button>

                  {/* Delete button (Admin or owner) */}
                  {(isAdmin || isMyCard) && (
                    <button
                      onClick={() => handleDeleteFriend(friend)}
                      className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                      title="Eliminar amigo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Claim Card Prompt (If user logged in and card is unassigned) */}
              {currentUser && !myLinkedFriend && !isClaimed && (
                <div className="my-2.5 p-2 rounded-xl bg-blue-950/40 border border-blue-800/60 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-blue-200">
                    ¿Eres tú? Vincula tu cuenta para votar lo tuyo.
                  </span>
                  <button
                    onClick={() => handleClaimCard(friend.id)}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] shrink-0 shadow"
                  >
                    Soy {friend.name}
                  </button>
                </div>
              )}

              {/* Quick Presets (Only if editable) */}
              <div className="flex items-center gap-1.5 py-2.5 overflow-x-auto no-scrollbar">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                  {!editable && <Lock className="w-3 h-3 text-slate-500" />}
                  Ajustes:
                </span>
                <button
                  type="button"
                  disabled={!editable}
                  onClick={() => handleApplyPreset(friend, 'all')}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-slate-900/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 whitespace-nowrap transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  🔥 Todo
                </button>
                <button
                  type="button"
                  disabled={!editable}
                  onClick={() => handleApplyPreset(friend, 'pisco-only')}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-slate-900/80 hover:bg-slate-700 text-amber-300 border border-amber-900/40 whitespace-nowrap transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  🍇 Solo Pisco
                </button>
                <button
                  type="button"
                  disabled={!editable}
                  onClick={() => handleApplyPreset(friend, 'terremoto-chela')}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-slate-900/80 hover:bg-slate-700 text-rose-300 border border-rose-900/40 whitespace-nowrap transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  🍧 Terremoto + 🍺 Chela
                </button>
                <button
                  type="button"
                  disabled={!editable}
                  onClick={() => handleApplyPreset(friend, 'gin-only')}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-slate-900/80 hover:bg-slate-700 text-cyan-300 border border-cyan-900/40 whitespace-nowrap transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  🍸 Gin & RedBull
                </button>
              </div>

              {/* Drink Selector Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {categories.map((cat) => {
                  const meta = CATEGORY_METADATA[cat];
                  const isChecked = !!friend.drinks[cat];
                  const catShare = calculation.categoryBreakdowns[cat];
                  const cost = catShare ? catShare.costPerPerson : 0;

                  return (
                    <button
                      key={cat}
                      type="button"
                      disabled={!editable}
                      onClick={() => handleToggleDrink(friend, cat)}
                      className={`flex flex-col p-2.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                        !editable ? 'cursor-not-allowed' : ''
                      } ${
                        isChecked
                          ? 'bg-slate-900/90 border-blue-500/80 ring-1 ring-blue-500/30 shadow-md'
                          : 'bg-slate-900/30 border-slate-800 text-slate-500 opacity-60 hover:opacity-100 hover:border-slate-700'
                      }`}
                    >
                      {/* Active indicator bar */}
                      {isChecked && (
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-red-500" />
                      )}

                      <div className="flex items-center justify-between w-full">
                        <span className="text-base">{meta.emoji}</span>
                        <div
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border text-[9px] ${
                            isChecked
                              ? 'bg-blue-600 border-blue-400 text-white font-bold'
                              : 'border-slate-700 text-transparent'
                          }`}
                        >
                          ✓
                        </div>
                      </div>

                      <div className="mt-1">
                        <div className={`text-xs font-semibold truncate ${isChecked ? 'text-white' : 'text-slate-400'}`}>
                          {meta.label}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {isChecked ? formatCLP(cost) : '$0'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Card Footer: Cuota Total */}
              <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  {!editable && <Lock className="w-3 h-3 text-slate-500" />}
                  <span>Cuota Total a Transferir:</span>
                </div>
                <span className="text-base font-extrabold text-emerald-400 font-mono bg-emerald-950/40 px-3 py-1 rounded-xl border border-emerald-800/40">
                  {formatCLP(totalCuota)}
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
