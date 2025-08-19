import React, { useState, useEffect } from 'react';
import { getActivities } from '../../services/activityApi';

const ActivityTable = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filterModel, setFilterModel] = useState('all');
  const [filterAction, setFilterAction] = useState('all');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const { data } = await getActivities();
      setActivities(data.data || []);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activities. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const filteredActivities = activities.filter(activity => {
    const modelMatch = filterModel === 'all' || activity.model === filterModel;
    const actionMatch = filterAction === 'all' || activity.action === filterAction;
    return modelMatch && actionMatch;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredActivities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);

  // Get unique models and actions for filters
  const uniqueModels = [...new Set(activities.map(a => a.model))];
  const uniqueActions = [...new Set(activities.map(a => a.action))];

  // Format timestamp
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Format changes for display
  const formatChanges = (changes) => {
    if (!changes) return 'N/A';
    return Object.entries(changes).map(([key, value]) => (
      <div key={key} className="mb-1">
        <strong>{key}:</strong> {JSON.stringify(value)}
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger my-4">
        {error}
        <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchActivities}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Activity Log</h3>
          <div className="d-flex gap-2">
            <select 
              className="form-select form-select-sm"
              value={filterModel}
              onChange={(e) => setFilterModel(e.target.value)}
            >
              <option value="all">All Models</option>
              {uniqueModels.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
            
            <select 
              className="form-select form-select-sm"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
            >
              <option value="all">All Actions</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
            
            <button 
              className="btn btn-sm btn-outline-primary"
              onClick={fetchActivities}
            >
              <i className="bi bi-arrow-clockwise"></i> Refresh
            </button>
          </div>
        </div>
        
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover table-striped">
              <thead className="table-light">
                <tr>
                  <th>Action</th>
                  <th>Model</th>
                  <th>Document ID</th>
                  <th>User</th>
                  <th>Timestamp</th>
                  <th>Changes</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map(activity => (
                    <tr key={activity._id}>
                      <td>
                        <span className={`badge ${
                          activity.action === 'create' ? 'bg-success' : 
                          activity.action === 'update' ? 'bg-warning text-dark' : 
                          'bg-danger'
                        }`}>
                          {activity.action.toUpperCase()}
                        </span>
                      </td>
                      <td>{activity.model}</td>
                      <td className="text-truncate" style={{ maxWidth: '150px' }} title={activity.documentId}>
                        {activity.documentId}
                      </td>
                      <td>
                        {activity.userId?.nom} {activity.userId?.prenom}
                        <div className="text-muted small">{activity.userId?.email}</div>
                      </td>
                      <td>{formatDate(activity.timestamp)}</td>
                      <td className="small">{formatChanges(activity.changes)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <div className="text-muted">No activities found</div>
                      {filterModel !== 'all' || filterAction !== 'all' ? (
                        <button 
                          className="btn btn-sm btn-link mt-2"
                          onClick={() => {
                            setFilterModel('all');
                            setFilterAction('all');
                          }}
                        >
                          Clear filters
                        </button>
                      ) : null}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="d-flex justify-content-center mt-4">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  >
                    Previous
                  </button>
                </li>
                
                {[...Array(totalPages).keys()].map(page => (
                  <li 
                    key={page + 1} 
                    className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}
                  >
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(page + 1)}
                    >
                      {page + 1}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
        
        <div className="card-footer bg-white text-muted small d-flex justify-content-between">
          <div>Showing {currentItems.length} of {filteredActivities.length} activities</div>
          <div>Page {currentPage} of {totalPages}</div>
        </div>
      </div>
    </div>
  );
};

export default ActivityTable;