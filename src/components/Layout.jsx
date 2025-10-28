import React, { useState } from 'react';
import TopHeader from './TopHeader';
import Sidebar from './Sidebar';
import PageHeader from './PageHeader';
import MainContent from './MainContent';
import InternalView from './InternalView';
import QuantityView from './QuantityView';
import AddMenuItemsModal from './AddMenuItemsModal';
import EditMenuItemModal from './EditMenuItemModal';

function Layout() {
  const [activeTab, setActiveTab] = useState('online');
  const [isAddItemsModalOpen, setIsAddItemsModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);

  const handleOpenEditItemModal = (itemId = null) => {
    setEditingItemId(itemId);
    setIsEditItemModalOpen(true);
  };

  const handleCloseEditItemModal = () => {
    setIsEditItemModalOpen(false);
    setEditingItemId(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'online':
        return <MainContent onEditItem={handleOpenEditItemModal} />;
      case 'internal':
        return <InternalView onEditItem={handleOpenEditItemModal} />;
      case 'quantity':
        return <QuantityView />;
      default:
        return <MainContent onEditItem={handleOpenEditItemModal} />;
    }
  };

  return (
    <>
      <TopHeader />
      <div className="main-layout">
        <Sidebar />
        <div className="content-area">
          <PageHeader
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenAddItemsModal={() => setIsAddItemsModalOpen(true)}
            onOpenMenuItemModal={() => handleOpenEditItemModal()}
          />
          {renderContent()}
        </div>
      </div>

      {/* Add Menu Items Modal */}
      {isAddItemsModalOpen && (
        <AddMenuItemsModal onClose={() => setIsAddItemsModalOpen(false)} />
      )}

      {/* Edit Menu Item Modal */}
      <EditMenuItemModal
        isOpen={isEditItemModalOpen}
        onClose={handleCloseEditItemModal}
        itemId={editingItemId}
      />
    </>
  );
}

export default Layout;

